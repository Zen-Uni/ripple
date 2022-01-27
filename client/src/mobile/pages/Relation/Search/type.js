/**
 * @description 集中管理PropType
 * @author Hans
 * @since 1.0
 */

import PropType from 'prop-types'

export const TypeResultListItemProps = {
    avatarURL: PropType.oneOfType([PropType.oneOf([null]), PropType.string]),
    tip: PropType.oneOfType([PropType.oneOf([null]), PropType.string]),
    email: PropType.string,
    status: PropType.number,
}
export const TypeResultListProps = {
    title: PropType.string,
    result: PropType.arrayOf(PropType.shape(TypeResultListItemProps)),
    setHandleClickGoBack: PropType.func,
}
