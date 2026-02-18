from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings as ChromaSettings
import logging
from typing import List, Dict, Optional
import os

logger = logging.getLogger(__name__)


class VectorStore:
    """Vector database for storing and retrieving document embeddings"""
    
    def __init__(
        self,
        embedding_model: str = "BAAI/bge-small-en-v1.5",
        persist_directory: str = "./data/chroma_db",
        collection_name: str = "nps_documents"
    ):
        """
        Initialize vector store with embedding model and ChromaDB
        
        Args:
            embedding_model: HuggingFace model name for embeddings
            persist_directory: Directory to persist ChromaDB
            collection_name: Name of the collection in ChromaDB
        """
        self.embedding_model_name = embedding_model
        self.persist_directory = persist_directory
        self.collection_name = collection_name
        
        # Create persist directory if it doesn't exist
        os.makedirs(persist_directory, exist_ok=True)
        
        logger.info(f"Loading embedding model: {embedding_model}")
        self.embedding_model = SentenceTransformer(embedding_model)
        
        logger.info(f"Initializing ChromaDB at: {persist_directory}")
        self.client = chromadb.PersistentClient(path=persist_directory)
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        
        logger.info(f"Vector store initialized with collection: {collection_name}")
    
    def add_documents(
        self,
        documents: List[str],
        metadatas: Optional[List[Dict]] = None,
        ids: Optional[List[str]] = None
    ) -> None:
        """
        Add documents to the vector store
        
        Args:
            documents: List of document texts
            metadatas: Optional list of metadata dictionaries
            ids: Optional list of document IDs
        """
        if not documents:
            logger.warning("No documents provided to add")
            return
        
        # Generate IDs if not provided
        if ids is None:
            ids = [f"doc_{i}" for i in range(len(documents))]
        
        # Generate embeddings
        logger.info(f"Generating embeddings for {len(documents)} documents")
        embeddings = self.embedding_model.encode(documents).tolist()
        
        # Add to collection
        self.collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        logger.info(f"Added {len(documents)} documents to vector store")
    
    def search(
        self,
        query: str,
        top_k: int = 5,
        filter_metadata: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search for similar documents
        
        Args:
            query: Search query text
            top_k: Number of results to return
            filter_metadata: Optional metadata filter
            
        Returns:
            List of dictionaries containing document, metadata, and distance
        """
        if not query or not query.strip():
            logger.warning("Empty query provided for search")
            return []
        
        logger.info(f"Searching for: {query[:100]}...")
        
        # Generate query embedding
        query_embedding = self.embedding_model.encode([query])[0].tolist()
        
        # Search in collection
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=filter_metadata
        )
        
        # Format results
        formatted_results = []
        if results and results['documents'] and len(results['documents']) > 0:
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    'document': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i] if results['metadatas'] else {},
                    'distance': results['distances'][0][i] if results['distances'] else 0.0,
                    'id': results['ids'][0][i]
                })
        
        logger.info(f"Found {len(formatted_results)} results")
        return formatted_results
    
    def get_collection_count(self) -> int:
        """Get the number of documents in the collection"""
        return self.collection.count()
    
    def delete_collection(self) -> None:
        """Delete the entire collection"""
        self.client.delete_collection(name=self.collection_name)
        logger.info(f"Deleted collection: {self.collection_name}")
