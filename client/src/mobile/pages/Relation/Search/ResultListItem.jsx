/**
 * @description 搜索结果列表单项
 * @author Hans
 * @since 1.0
 */

/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */

import { ListItem, Avatar, ListItemButton } from '@mui/material'
import { TypeResultListItemProps } from './type'
import { css } from '@emotion/react'
import { useNavigate } from 'react-router-dom'

function FriendListItem(props) {
    const navigate = useNavigate()
    const handleClickBack = () => {
        navigate(`/chat/${''}`)
    }

    return (
        <ListItem disablePadding onClick={handleClickBack}>
            <ListItemButton>
                <Avatar variant="rounded" src={props.avatarURL}></Avatar>
                <span
                    css={css`
                        margin: 0 0 0 1rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: calc(100vw - 100px);
                    `}
                >
                    {props.tip === null
                        ? props.email
                        : ''.concat(props.tip, ' (', props.email, ')')}
                </span>
            </ListItemButton>
        </ListItem>
    )
}

FriendListItem.propTypes = TypeResultListItemProps

export default FriendListItem
