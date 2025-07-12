import { Box, Button, Checkbox, FormControlLabel, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab"
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react"
import Review from "./Review";
import { useFetchAddresQuery, useUpdateUserAddressMutation } from "../account/accountApi";
import type { ConfirmationToken, StripeAddressElementChangeEvent, StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { useBasket } from "../../lib/hooks/useBasket";
import { currencyFormat } from "../../lib/util";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const steps = ['Address', 'Paymet', 'Review'];

export default function CheckoutStepper() {
    const [activeStepper, setActiveStep] = useState(0);
    const {basket} = useBasket();
    const { data, isLoading } = useFetchAddresQuery();
    const { name = "", ...restAddress } = data ?? {};
    const [updateAddress] = useUpdateUserAddressMutation();
    const [savedAddressChecked, setSaveAddressChecked] = useState(false);
    const elements = useElements();
    const stripe = useStripe();
    const navigate = useNavigate();
    const [addressComplete, setAddressComplete] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const {total, clearBasket} = useBasket();
    const [confirmationToken, setConfirmationToken] = useState<ConfirmationToken | null>(null);

    const handleNext = async () => {
        if (activeStepper === 0 && savedAddressChecked && elements) {
            const address = await getStripeAddress();
            if (address) await updateAddress(address);
        }
        if (activeStepper === 1) {
            if (!elements || !stripe) return;
            const result = await elements.submit();
            if (result.error) return toast.error(result.error.message);

            const stripResult = await stripe.createConfirmationToken({elements});
            if (stripResult.error) return toast.error(stripResult.error.message);
            setConfirmationToken(stripResult.confirmationToken);
        }
        if (activeStepper === 2){
            await confirmPayment();
        }
        if (activeStepper < 2) setActiveStep(step => step + 1);
    }

    const confirmPayment = async () => {
        setSubmitting(true);
        try {
            if (!confirmationToken || !basket?.clientSecret) 
                throw new Error("Unable to process");
            
            const paymentResult = await stripe?.confirmPayment({
                clientSecret: basket.clientSecret,
                redirect: 'if_required',
                confirmParams: {
                    confirmation_token: confirmationToken.id,
                }
            });

            if (paymentResult?.paymentIntent?.status === 'succeeded') {
                navigate('/checkout/success');
                clearBasket();
            } else if (paymentResult?.error) {
               throw new Error (paymentResult.error.message)
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
            setActiveStep(step => step - 1);

        } finally {
            setSubmitting(false)
        }
    }

    const getStripeAddress = async () => {
        const addressElement = elements?.getElement('address');
        if (!addressElement) return null
        const { value: { name, address } } = await addressElement.getValue();

        if (name && address) return { ...address, name }

        return null;
    }

    const handleBack = () => {
        setActiveStep(step => step - 1);
    }

    const handleAddressChange = (event: StripeAddressElementChangeEvent) => {
        setAddressComplete(event.complete)
    }

    const handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
        setPaymentComplete(event.complete)
    }

    if (isLoading) return <Typography variant="h6">Loading checkout ...</Typography>

    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stepper activeStep={activeStepper}>
                {steps.map((label, index) => {
                    return (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>

            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: activeStepper === 0 ? 'block' : 'none' }}>
                    <AddressElement
                        options={{
                            mode: "shipping",
                            defaultValues: {
                                name: name,
                                address: restAddress && 'country' in restAddress ? restAddress : undefined
                            }
                        }}
                        onChange={handleAddressChange}
                    />
                    <FormControlLabel
                        sx={{ display: 'flex', justifyContent: 'end' }}
                        control={<Checkbox
                            checked={savedAddressChecked}
                            onChange={e => setSaveAddressChecked(e.target.checked)}
                        />}
                        label='Save address for faster check out'
                    />
                </Box>
                <Box sx={{ display: activeStepper === 1 ? 'block' : 'none' }}>
                    <PaymentElement 
                        onChange={handlePaymentChange} />
                </Box>
                <Box sx={{ display: activeStepper === 2 ? 'block' : 'none' }}>
                    <Review confirmationToken={confirmationToken} />
                </Box>
            </Box>

            <Box display='flex' paddingTop={2} justifyContent='space-between'>
                <Button onClick={handleBack}>Back</Button>
                <LoadingButton
                    onClick={handleNext}
                    disabled={
                        (activeStepper === 0 && !addressComplete) ||
                        (activeStepper === 1 && !paymentComplete) ||
                        submitting
                    }
                    loading={submitting}
                >
                    {activeStepper === steps.length - 1 ? `Pay ${currencyFormat(total)}` : 'Next'}
                </LoadingButton>
            </Box>
        </Paper>
    )
}

