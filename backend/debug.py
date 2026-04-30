import asyncio
from services.gemini_service import explain_rights

async def test():
    try:
        res = await explain_rights("I am being bullied by classmates.")
        print("SUCCESS:", res)
    except Exception as e:
        print("EXCEPTION TYPE:", type(e))
        print("EXCEPTION STR:", str(e))
        import traceback
        traceback.print_exc()

asyncio.run(test())
