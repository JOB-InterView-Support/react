// 결제성공.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router'

const PaymentSuccessContainer = () => {
	const router = useRouter();
    const { paymentKey, orderId, amount } = router.query;
    useEffect(()=>{
    	const init = async() => {
        	// ... 대충 결제에 성공하면 백단에 정보 저장하는 API
        }
    },[])
	return (
    	<div> 
          <div>결제 성공</div>
        </div>
    )
}