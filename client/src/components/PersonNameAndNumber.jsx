const PersonNameAndNumber = (props) => {
    const object = props.object;
    const handleDelete = props.handleDelete;
    
    return (
        <li>
            {object.name} {object.number}
            <button onClick={()=> handleDelete(object.id)}>delete</button>
        </li>
    )
}

export default PersonNameAndNumber;