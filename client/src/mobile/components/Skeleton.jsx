/**
 * @description 骨架屏组件
 * @author Uni
 * @since 1.0
 */

import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function mockService() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(false)
        }, 3000)
    })
}

export default function Skelet(props) {
    const { children, config = {} } = props
    const { variant = "rectangular", animation = false, service = mockService } = config
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            const res = service && await service()
            setIsLoading(res)
        }

        fetchData()
    }, [])

    return (
        <>
            {
                // isLoading ? <Skeleton height="80vh">{ children }</Skeleton> : children
                isLoading ? <SkeletItem/> : children
            }
        </>
    )
}

function SkeletItem() {
    const el = (
        <Box sx={{margin: 1}}>
           {/* <Skeleton variant="circular"/> */}
           <Skeleton variant="text">
               <h1></h1>
           </Skeleton>
        </Box>
    )
    const arr = new Array(10).fill(0)
    return (
       <div>
           {
               arr.map(() => {
                   return el
               })
           }
       </div>
    )
}

