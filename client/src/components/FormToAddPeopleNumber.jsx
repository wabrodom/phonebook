
const FormToAddPeopleNumber = (props) => {
    const {handleSubmit, handleNameChange, handlePhoneChange, newName, newPhone} = props;

    return (
        <section>
            <form onSubmit={handleSubmit} name="FormToAddPeopleNumber">

                <div>
                    name: <input 
                        onChange={handleNameChange}
                        value={newName}
                        id="name"
                        name="name"
                        />
                </div>

                <div>
                    number: <input
                        onChange={handlePhoneChange}
                        value={newPhone}
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                    />
                </div>

                <div>
                    <button type="submit">add</button>
                </div>

            </form>
        </section>
    )
}

export default FormToAddPeopleNumber;