import os

DB_FILE = "readings.db"

def reset_db():
    if os.path.exists(DB_FILE):
        try:
            os.remove(DB_FILE)
            print(f"Successfully deleted {DB_FILE}")
        except Exception as e:
            print(f"Error deleting {DB_FILE}: {e}")
    else:
        print(f"{DB_FILE} does not exist.")

if __name__ == "__main__":
    confirmation = input("Are you sure you want to delete the database? This cannot be undone. (y/n): ")
    if confirmation.lower() == 'y':
        reset_db()
    else:
        print("Operation cancelled.")
