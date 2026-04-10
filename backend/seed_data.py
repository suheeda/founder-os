"""
Seed script for Founder OS.
Populates videos and dictionary entries.

Run manually:
python seed_data.py
"""

from database import engine, SessionLocal
from models import Base, Video, DictionaryEntry

# Create tables
Base.metadata.create_all(bind=engine)

VIDEOS = [
    # Fundraising
    {
        "title": "How to Raise a Seed Round",
        "url": "https://www.youtube.com/watch?v=gcevHkNGrWQ",
        "category": "Fundraising",
    },
    {
        "title": "Investor Meeting Advice for Startups",
        "url": "https://www.youtube.com/watch?v=ETPVIvRbhWU",
        "category": "Fundraising",
    },
    {
        "title": "How to Build a Startup Pitch Deck",
        "url": "https://www.youtube.com/watch?v=Cnt3BEbHNY4",
        "category": "Fundraising",
    },

    # Legal
    {
        "title": "ESOP Explained for Founders",
        "url": "https://www.youtube.com/watch?v=kPovHr8JnIM",
        "category": "Legal",
    },
    {
        "title": "Cap Table Basics for Startups",
        "url": "https://www.youtube.com/watch?v=uxHtiYZ5pRA",
        "category": "Legal",
    },
    {
        "title": "Founder Vesting Explained",
        "url": "https://www.youtube.com/watch?v=YLh20JDLxS0",
        "category": "Legal",
    },

    # Growth
    {
        "title": "How to Get Your First 100 Customers",
        "url": "https://www.youtube.com/watch?v=acTSGL7nVfY",
        "category": "Growth",
    },
    {
        "title": "What is Product Market Fit",
        "url": "https://www.youtube.com/watch?v=jMA2sjkloKE",
        "category": "Growth",
    },
    {
        "title": "Startup Growth Strategies",
        "url": "https://www.youtube.com/watch?v=9w36HcZGzYU",
        "category": "Growth",
    },

    # Operations
    {
        "title": "Hiring Your First Employees",
        "url": "https://www.youtube.com/watch?v=fwjp85-NxdQ",
        "category": "Operations",
    },
    {
        "title": "Running Effective Startup Standups",
        "url": "https://www.youtube.com/watch?v=qv89RVYF0lM",
        "category": "Operations",
    },
    {
        "title": "Founder Burnout and Mental Health",
        "url": "https://www.youtube.com/watch?v=NimibAzhSpw",
        "category": "Operations",
    },
]

DICTIONARY = [
    {"term": "ESOP", "definition": "Employee Stock Option Plan. A way to give employees stock options so they share in the company’s future value."},
    {"term": "Cap Table", "definition": "Capitalization Table. A record of ownership including founders, employees, and investors."},
    {"term": "ARR", "definition": "Annual Recurring Revenue. The yearly value of subscription revenue."},
    {"term": "MRR", "definition": "Monthly Recurring Revenue. Predictable monthly revenue."},
    {"term": "Runway", "definition": "How long a startup can operate before running out of money."},
    {"term": "Burn Rate", "definition": "The rate at which a startup spends money each month."},
    {"term": "Churn", "definition": "The rate at which customers stop using a product."},
    {"term": "Term Sheet", "definition": "A document outlining investment terms before legal agreements."},
    {"term": "Pre-money Valuation", "definition": "Startup value before new investment."},
    {"term": "Post-money Valuation", "definition": "Startup value after investment."},
    {"term": "Liquidation Preference", "definition": "Determines investor payouts before founders."},
    {"term": "Anti-dilution", "definition": "Protects investor ownership during down rounds."},
    {"term": "Vesting", "definition": "Earning equity over time instead of immediately."},
    {"term": "Cliff", "definition": "Minimum time before equity starts vesting."},
    {"term": "SAFe Note", "definition": "Simple Agreement for Future Equity used in early-stage funding."},
    {"term": "MOU", "definition": "Memorandum of Understanding before formal contract."},
    {"term": "NDA", "definition": "Agreement to keep information confidential."},
    {"term": "Due Diligence", "definition": "Process of evaluating a startup before investment."},
    {"term": "PMF", "definition": "Product-Market Fit where product meets real demand."},
    {"term": "GTM", "definition": "Go-To-Market strategy for reaching customers."},
    {"term": "CAC", "definition": "Customer Acquisition Cost."},
    {"term": "LTV", "definition": "Lifetime Value of a customer."},
    {"term": "CTO", "definition": "Chief Technology Officer."},
    {"term": "CFO", "definition": "Chief Financial Officer."},
    {"term": "Board Member", "definition": "Person guiding company strategy and governance."},
]


def seed():
    db = SessionLocal()
    try:
        # Clear existing learning data
        db.query(Video).delete()
        db.query(DictionaryEntry).delete()
        db.commit()

        # Insert videos
        for video in VIDEOS:
            db.add(Video(**video))

        # Insert dictionary
        for entry in DICTIONARY:
            db.add(DictionaryEntry(**entry))

        db.commit()
        print(f"Seeded {len(VIDEOS)} videos and {len(DICTIONARY)} dictionary entries.")

    except Exception as e:
        db.rollback()
        print("Seeding failed:", e)
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()