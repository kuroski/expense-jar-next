import { List } from '@/lib/list/codable'
import React from 'react'

type ListItemProps = List

const ListItem = (props: ListItemProps): JSX.Element => {
  return <div>{props.urlId}</div>
}

export default ListItem
