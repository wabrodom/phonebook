
const FilterByName = ({handleChange, searchName}) => {
    return (
            <p>
                Filter shown with 
                    <input 
                        onChange={handleChange}
                        value={searchName}
                    />
            </p>
    )
}

export default FilterByName;