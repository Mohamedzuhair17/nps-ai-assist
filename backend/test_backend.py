"""
Test script to verify the RAG backend is working correctly
Run this after starting the backend server
"""

import requests
import json
from colorama import init, Fore, Style

# Initialize colorama for colored output
init(autoreset=True)

BASE_URL = "http://localhost:8000"

def print_header(text):
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN}{text}")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")

def print_success(text):
    print(f"{Fore.GREEN}✅ {text}{Style.RESET_ALL}")

def print_error(text):
    print(f"{Fore.RED}❌ {text}{Style.RESET_ALL}")

def print_info(text):
    print(f"{Fore.YELLOW}ℹ️  {text}{Style.RESET_ALL}")

def test_health_check():
    """Test the health check endpoint"""
    print_header("Testing Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Health check passed!")
            print(f"   Status: {data['status']}")
            print(f"   Ollama Connected: {data['ollama_connected']}")
            print(f"   Vector DB Documents: {data['vector_db_documents']}")
            print(f"   Supported Languages: {', '.join(data['supported_languages'])}")
            return True
        else:
            print_error(f"Health check failed with status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to backend. Is it running at http://localhost:8000?")
        return False
    except Exception as e:
        print_error(f"Health check failed: {e}")
        return False

def test_chat_english():
    """Test chat in English"""
    print_header("Testing Chat in English")
    
    query = "What is NPS?"
    print_info(f"Query: {query}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={
                "query": query,
                "top_k": 5,
                "temperature": 0.7
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("English chat test passed!")
            print(f"\n{Fore.WHITE}Response:{Style.RESET_ALL}")
            print(f"{data['response'][:300]}...")
            print(f"\n   Detected Language: {data['detected_language']}")
            print(f"   Retrieved Documents: {data['retrieved_documents']}")
            return True
        else:
            print_error(f"Chat failed with status {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print_error(f"English chat test failed: {e}")
        return False

def test_chat_tamil():
    """Test chat in Tamil"""
    print_header("Testing Chat in Tamil")
    
    query = "என்பிஎஸ் என்றால் என்ன?"
    print_info(f"Query: {query} (What is NPS?)")
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={
                "query": query,
                "top_k": 5,
                "temperature": 0.7
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Tamil chat test passed!")
            print(f"\n{Fore.WHITE}Response:{Style.RESET_ALL}")
            print(f"{data['response'][:300]}...")
            print(f"\n   Detected Language: {data['detected_language']}")
            print(f"   English Query: {data.get('english_query', 'N/A')}")
            print(f"   Retrieved Documents: {data['retrieved_documents']}")
            return True
        else:
            print_error(f"Chat failed with status {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print_error(f"Tamil chat test failed: {e}")
        return False

def test_chat_hindi():
    """Test chat in Hindi"""
    print_header("Testing Chat in Hindi")
    
    query = "NPS में टैक्स बेनिफिट क्या है?"
    print_info(f"Query: {query} (What are the tax benefits in NPS?)")
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={
                "query": query,
                "top_k": 5,
                "temperature": 0.7
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Hindi chat test passed!")
            print(f"\n{Fore.WHITE}Response:{Style.RESET_ALL}")
            print(f"{data['response'][:300]}...")
            print(f"\n   Detected Language: {data['detected_language']}")
            print(f"   English Query: {data.get('english_query', 'N/A')}")
            print(f"   Retrieved Documents: {data['retrieved_documents']}")
            return True
        else:
            print_error(f"Chat failed with status {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print_error(f"Hindi chat test failed: {e}")
        return False

def test_document_count():
    """Test document count endpoint"""
    print_header("Testing Document Count")
    
    try:
        response = requests.get(f"{BASE_URL}/documents/count", timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Document count: {data['total_documents']}")
            return True
        else:
            print_error(f"Document count failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Document count test failed: {e}")
        return False

def main():
    """Run all tests"""
    print(f"{Fore.CYAN}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║         NPS RAG Backend - Test Suite                      ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Style.RESET_ALL}")
    
    tests = [
        ("Health Check", test_health_check),
        ("Document Count", test_document_count),
        ("English Chat", test_chat_english),
        ("Tamil Chat", test_chat_tamil),
        ("Hindi Chat", test_chat_hindi),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except KeyboardInterrupt:
            print_error("\nTests interrupted by user")
            break
        except Exception as e:
            print_error(f"Unexpected error in {test_name}: {e}")
            results.append((test_name, False))
    
    # Print summary
    print_header("Test Summary")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = f"{Fore.GREEN}PASSED" if result else f"{Fore.RED}FAILED"
        print(f"   {test_name}: {status}{Style.RESET_ALL}")
    
    print(f"\n{Fore.CYAN}Total: {passed}/{total} tests passed{Style.RESET_ALL}")
    
    if passed == total:
        print(f"\n{Fore.GREEN}🎉 All tests passed! Your backend is working correctly.{Style.RESET_ALL}")
    else:
        print(f"\n{Fore.YELLOW}⚠️  Some tests failed. Please check the errors above.{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
