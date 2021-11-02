import React from 'react'
import styled from '@emotion/styled'
import {keyframes} from '@emotion/react'

const enterAnimation = keyframes`
from {
transform: translateX(-100px);
opacity: 0;
} to {
transform: translateX(0);
opacity: 1;
}
`

const SubHistoryContainer = styled.div`
  background: #111f11a1;
  border-radius: 2px;
  margin: 5px;
  padding: 5px;
  gap: 10px;
  width: 400px;
  font-size: 14px;
  color: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  h3 {
    margin-top: 0;
  }
  animation: ${enterAnimation} 300ms ease;
`

function Card({
  latitude,
  longitude,
  createdAt,
  type,
}: {
  latitude: number
  longitude: number
  createdAt: number
  type: string
}) {
  return (
    <SubHistoryContainer>
      <span>
        <h3> Animal</h3>
        {type}
      </span>
      <div>
        <span>
          <h3>Location</h3>({latitude}, {longitude})
        </span>
      </div>
      <span>
        <h3>Created At</h3> {createdAt}
      </span>
    </SubHistoryContainer>
  )
}

export default Card
