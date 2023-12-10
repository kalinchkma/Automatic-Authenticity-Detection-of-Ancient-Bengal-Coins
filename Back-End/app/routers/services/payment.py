from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from pydantic import *
import stripe
from decouple import config

# internals imports
from ...internals.auth import get_current_active_user, ResponseUser

# ROUTER
router = APIRouter(
    prefix="/payment",
    tags=["payment"],
    responses={404: {"description": "Service not found"}}
)

# User request model
class PaymentRequestBody(BaseModel):
    amount: StrictFloat
    currency: StrictStr
    card_number: StrictStr
    exp_month: StrictInt
    exp_year: StrictInt
    cvc: StrictStr


@router.post("/process-payment")
async def payment_process(payment_data: PaymentRequestBody, auth_user: Annotated[ResponseUser, Depends(get_current_active_user)]):
    try:
        stripe.api_key = config('STRIP_KEY')
        payment_intent = stripe.PaymentIntent.create(
          amount=int(payment_data.amount*100),
          currency=payment_data.currency,
          payment_method_data={
              "type": "card",
              "card": {
                  "number": payment_data.card_number,
                  "exp_month": payment_data.exp_month,
                  "exp_year": payment_data.exp_year,
                  "cvc": payment_data.cvc
              }
          }
        )
        
        # Confirm the payment intent
        stripe.PaymentIntent.confirm(payment_intent.id)
        return {"success": "payment success"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    