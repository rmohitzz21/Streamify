import React, { useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';

const CallPage = () => {
  const {id:callId} = useParams()
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const {authUser , isLoading} = useAuthUser();

  const { data: tokenData } = useQuery()
  

  return (
    <div>CallPage</div>
  )
}

export default CallPage