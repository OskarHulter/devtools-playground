import { GroupedVirtuoso } from 'react-virtuoso'

export function DataList() {
  const groupCounts = React.useMemo(() => {
    return Array(1000).fill(10)
  }, [])
  const x = {
    "Key": "c0fbd796-0609-4682-8d12-4cb5afef3baf",
    "Value": {
      "X": 1,
      "Y": 2
    },
    "Books": {
      "$Random": [
        "B1",
        "B2",
        "B3"
      ]
    },
    "Age": {
      "$Random": {
        "$Count": 3,
        "$Min": 20,
        "$Max": 30
      }
    }
  }


  return (<GroupedVirtuoso
    style={{ height: 400 }}
    groupCounts={groupCounts}
    groupContent={index => {
      return (
        <div style={{ backgroundColor: 'var(--ifm-color-content-inverse)' }}>Group {index * 10} - {index * 10 + 10}</div>
      )
    }}
    itemContent={(index, groupIndex) => (<div>{index} (group {groupIndex})</div>)}
  />)
}
