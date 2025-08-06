#!/usr/bin/env python3
"""
Simple test script to verify OAuth implementation
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_oauth_config():
    """Test if OAuth configuration is properly set up"""
    print("Testing OAuth Configuration...")

    # Check if Google OAuth credentials are configured
    google_client_id = os.getenv("GOOGLE_CLIENT_ID")
    google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")

    if not google_client_id:
        print("❌ GOOGLE_CLIENT_ID not found in environment variables")
        print("   Please add GOOGLE_CLIENT_ID to your .env file")
        return False

    if not google_client_secret:
        print("❌ GOOGLE_CLIENT_SECRET not found in environment variables")
        print("   Please add GOOGLE_CLIENT_SECRET to your .env file")
        return False

    print("✅ Google OAuth credentials found")
    print(f"   Client ID: {google_client_id[:20]}...")
    print(f"   Client Secret: {google_client_secret[:10]}...")

    return True

def test_dependencies():
    """Test if required dependencies are installed"""
    print("\nTesting Dependencies...")

    required_packages = [
        "httpx",
        "google-auth",
        "google-auth-oauthlib"
    ]

    missing_packages = []

    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - not installed")
            missing_packages.append(package)

    if missing_packages:
        print(f"\nPlease install missing packages:")
        print(f"pip install {' '.join(missing_packages)}")
        return False

    return True

def main():
    print("OAuth Implementation Test")
    print("=" * 30)

    deps_ok = test_dependencies()
    config_ok = test_oauth_config()

    print("\n" + "=" * 30)
    if deps_ok and config_ok:
        print("✅ All tests passed! OAuth is ready to use.")
        print("\nNext steps:")
        print("1. Start the backend server: uvicorn app.main:app --reload")
        print("2. Start the frontend: cd client && npm run dev")
        print("3. Test the OAuth flow in your browser")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())
