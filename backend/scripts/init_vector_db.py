"""
Script to initialize the vector database with NPS knowledge base
Run this script to populate the database with initial documents
"""

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.vector_store import VectorStore
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# NPS Knowledge Base Documents
NPS_DOCUMENTS = [
    # Basic Information
    """National Pension System (NPS) is a voluntary, defined contribution retirement savings scheme designed to enable systematic savings. 
    It was launched in January 2004 for government employees and opened to all Indian citizens in 2009. 
    NPS is regulated by the Pension Fund Regulatory and Development Authority (PFRDA).""",
    
    # Eligibility
    """NPS Eligibility: Any Indian citizen between 18-70 years can open an NPS account. 
    NRIs are also eligible to open and contribute to NPS accounts. 
    There is no upper limit on income for NPS enrollment.""",
    
    # Account Types
    """NPS has two types of accounts:
    Tier I Account: This is the mandatory pension account with tax benefits but restricted withdrawals until retirement.
    Tier II Account: This is a voluntary savings account with flexible withdrawals but no tax benefits (except for government employees under certain conditions).""",
    
    # Tax Benefits - Section 80C
    """NPS Tax Benefits under Section 80C: Contributions to NPS Tier I account are eligible for deduction up to ₹1.5 lakh under Section 80C of the Income Tax Act. 
    This deduction is part of the overall ₹1.5 lakh limit under Section 80C which includes other investments like PPF, ELSS, life insurance premiums, etc.""",
    
    # Tax Benefits - Section 80CCD(1B)
    """NPS Additional Tax Benefit under Section 80CCD(1B): An additional deduction of up to ₹50,000 is available exclusively for NPS contributions under Section 80CCD(1B). 
    This is over and above the ₹1.5 lakh limit under Section 80C. 
    This makes NPS one of the most tax-efficient retirement savings options.""",
    
    # Tax Benefits - Employer Contribution
    """Employer Contribution Tax Benefits under Section 80CCD(2): Employer contributions to NPS are deductible up to 10% of salary (Basic + DA) for private sector employees and up to 14% for central government employees. 
    This deduction is over and above the Section 80C and 80CCD(1B) limits.""",
    
    # Minimum Contribution
    """NPS Minimum Contribution Requirements:
    For Tier I: Minimum ₹500 per contribution, minimum ₹1,000 per year to keep account active.
    For Tier II: Minimum ₹250 per contribution, minimum ₹2,000 for account opening.
    There is no maximum limit on contributions.""",
    
    # Investment Options
    """NPS Investment Options: Subscribers can choose from two investment approaches:
    1. Active Choice: You decide the allocation between Equity (E), Corporate Bonds (C), and Government Securities (G).
    2. Auto Choice (Life Cycle Fund): Asset allocation automatically adjusts based on your age, becoming more conservative as you approach retirement.""",
    
    # Fund Managers
    """NPS Fund Managers: PFRDA has empaneled several professional fund managers including:
    - SBI Pension Funds Pvt. Ltd.
    - LIC Pension Fund Ltd.
    - UTI Retirement Solutions Ltd.
    - ICICI Prudential Pension Funds Management Company Ltd.
    - Kotak Mahindra Pension Fund Ltd.
    - HDFC Pension Management Company Ltd.
    - Aditya Birla Sun Life Pension Management Ltd.
    Subscribers can choose their preferred fund manager and can change once a year.""",
    
    # Withdrawal at 60
    """NPS Withdrawal Rules at Age 60 (Normal Exit):
    - You can withdraw up to 60% of the accumulated corpus as a lump sum, which is tax-free.
    - The remaining 40% must be used to purchase an annuity (pension plan) from a PFRDA-empaneled insurance company.
    - The annuity provides regular monthly pension income.""",
    
    # Premature Withdrawal
    """NPS Premature Withdrawal (Exit before 60):
    - Allowed only after completing 5 years in NPS.
    - You can withdraw only 20% as lump sum.
    - The remaining 80% must be used to purchase an annuity.
    - The lump sum withdrawal is taxable as per your income tax slab.""",
    
    # Partial Withdrawal
    """NPS Partial Withdrawal Rules:
    - Allowed after 3 years of account opening.
    - Maximum 25% of own contributions (not employer contributions) can be withdrawn.
    - Allowed maximum 3 times during the entire tenure.
    - Permitted for specific purposes: children's higher education, children's marriage, purchase/construction of residential house, treatment of critical illnesses.
    - Partial withdrawals are tax-free.""",
    
    # Account Opening Process
    """How to Open NPS Account Online (eNPS):
    1. Visit the eNPS portal at enps.nsdl.com
    2. Click on 'Registration' and select 'Individual Subscriber'
    3. Choose registration type (Aadhaar-based or non-Aadhaar)
    4. Fill in personal details, contact information, and nominee details
    5. Complete KYC verification using Aadhaar OTP or upload documents
    6. Choose investment preferences (fund manager, investment choice, scheme preference)
    7. Make initial contribution (minimum ₹500)
    8. Submit application and receive PRAN (Permanent Retirement Account Number)
    The entire process takes about 15-20 minutes.""",
    
    # Required Documents
    """Documents Required for NPS Account Opening:
    - PAN Card (mandatory)
    - Aadhaar Card (for Aadhaar-based eKYC)
    - Bank account details (cancelled cheque or bank statement)
    - Passport-size photograph
    - Address proof (if not using Aadhaar)
    - Date of birth proof (if not using Aadhaar)
    For NRIs: Valid passport, overseas address proof, and PIO/OCI card if applicable.""",
    
    # PRAN
    """PRAN (Permanent Retirement Account Number):
    PRAN is a unique 12-digit number allotted to each NPS subscriber. 
    It remains the same throughout the subscriber's lifetime, even if they change jobs or locations. 
    PRAN is portable across jobs and locations. 
    You can access your NPS account online using PRAN and password through the CRA (Central Recordkeeping Agency) system.""",
    
    # Contribution Methods
    """Ways to Contribute to NPS:
    1. Online: Through eNPS portal, netbanking, UPI, debit card
    2. Points of Presence (PoP): Banks and other authorized entities
    3. D-Remit: For government employees through their DDO
    4. Standing Instructions: Set up auto-debit from bank account
    Contributions can be made monthly, quarterly, or annually as per convenience.""",
    
    # Annuity Options
    """NPS Annuity Options at Retirement:
    When you purchase annuity with 40% (or 80% in case of premature exit) of corpus, you can choose from:
    1. Annuity for life with return of purchase price on death
    2. Annuity for life with 100% of annuity payable to spouse on death
    3. Annuity for life with provision of 50% of annuity payable to spouse on death
    4. Annuity for life increasing at a simple rate of 3% per annum
    5. Annuity for life with 5 or 10 year certain period
    The annuity amount received is taxable as per your income tax slab.""",
    
    # NPS vs Other Investments
    """NPS vs Other Retirement Options:
    Compared to EPF: NPS offers higher equity exposure (up to 75%), better tax benefits (additional ₹50,000 under 80CCD(1B)), but EPF offers guaranteed returns.
    Compared to PPF: NPS has better tax benefits, higher potential returns through equity, but PPF offers guaranteed returns and complete tax-free withdrawal.
    Compared to Mutual Funds: NPS has lower expense ratios (capped at 0.09%), additional tax benefits, but less liquidity.
    NPS is best suited for long-term retirement planning with tax efficiency.""",
    
    # Corporate NPS
    """Corporate NPS (All Citizens Model):
    Employers can offer NPS as a retirement benefit to employees. 
    Benefits include:
    - Employer contributions are tax-deductible for the company
    - Employer contributions up to 10% of salary are tax-free for employees (14% for government employees)
    - Simplified contribution process through employer
    - Better retirement planning for employees
    Many companies now offer NPS as part of their compensation structure.""",
    
    # NPS for NRIs
    """NPS for Non-Resident Indians (NRIs):
    NRIs can open and maintain NPS accounts with some conditions:
    - Can open account while resident in India or as NRI
    - Contributions can be made in Indian Rupees from NRE/NRO accounts
    - Cannot contribute once they become foreign nationals
    - Withdrawals follow same rules as resident Indians
    - Repatriation of funds subject to FEMA regulations
    NPS provides NRIs a way to save for retirement in India with tax benefits.""",
]


def initialize_vector_db():
    """Initialize vector database with NPS knowledge"""
    try:
        logger.info("Initializing Vector Store...")
        
        vector_store = VectorStore(
            embedding_model=settings.embedding_model,
            persist_directory=settings.chroma_persist_dir
        )
        
        # Check if documents already exist
        existing_count = vector_store.get_collection_count()
        
        if existing_count > 0:
            logger.warning(f"Vector store already contains {existing_count} documents.")
            response = input("Do you want to delete existing documents and reinitialize? (yes/no): ")
            
            if response.lower() == 'yes':
                logger.info("Deleting existing collection...")
                vector_store.delete_collection()
                
                # Recreate vector store
                vector_store = VectorStore(
                    embedding_model=settings.embedding_model,
                    persist_directory=settings.chroma_persist_dir
                )
            else:
                logger.info("Keeping existing documents. Exiting.")
                return
        
        # Add documents
        logger.info(f"Adding {len(NPS_DOCUMENTS)} documents to vector store...")
        
        # Generate IDs
        ids = [f"nps_doc_{i}" for i in range(len(NPS_DOCUMENTS))]
        
        # Generate metadata
        metadatas = [{"source": "nps_knowledge_base", "doc_id": i} for i in range(len(NPS_DOCUMENTS))]
        
        vector_store.add_documents(
            documents=NPS_DOCUMENTS,
            metadatas=metadatas,
            ids=ids
        )
        
        final_count = vector_store.get_collection_count()
        logger.info(f"✅ Successfully initialized vector store with {final_count} documents!")
        
    except Exception as e:
        logger.error(f"Failed to initialize vector database: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    logger.info("Starting NPS Vector Database Initialization...")
    initialize_vector_db()
    logger.info("Initialization complete!")
