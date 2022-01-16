/**
 * @description 项目挂在根组件
 * @author Uni
 * @since version 1.0
 */

import { useMediaQuery } from 'react-responsive'
import Mobile from './mobile'

export default function App() {

  const isMobile = useMediaQuery({
    query: '(max-width: 768px)'
  })

  const isPC = useMediaQuery({
    query: '(min-width: 768px)'
  })

  return (
    <>
      <div>
        {
          isMobile && <Mobile/>
        }
        {
          isPC && <div>this is Web PC</div>
        }
      </div>
    </>

  )
}