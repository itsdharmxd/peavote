import axios from "axios";
import { useState } from "react";

function Home(){
    const [options, setOptions] = useState([])
    const [title, setTitle] = useState('')
    const [error, setError] = useState('')
    const [limitIP, setLimitIP] = useState('yes')
    const [expiryDate, setExpiryDate] = useState('never')

    const addOption = () => {
        setOptions([...options, ""])
    }

    const handleOptionChange = (text, i) => {
        const newOptions = [...options]
        newOptions[i] = text
        setOptions(newOptions)
    }

    const handleKeyPress = e => {
        if(e.key === 'Enter'){
            addOption()
        }
    }

    const renderOptions = () => {
        return options.map((option, index) => {
            return (
                <input
                type = "text"
                key = {index}
                placeholder = "Choose an option.."
                onKeyPress = {handleKeyPress}
                value={options[index]}
                onChange={e => handleOptionChange(e.target.value, index)} />
            )
        })
    }

    const handleSubmit = () => {
        const trimmedOptions = options.map(option => option.trim())
        const filteredOptions = trimmedOptions.filter(option => option !== "")

        if(filteredOptions.length < 2){
            return setError("You must have at least 2 non-empty options.")
        }

        if(title.trim() === ""){
            return setError("You must have a title for creating the poll.")
        }

        const uniqueOptions = [...new Set(filteredOptions)]
        if(uniqueOptions.length !== filteredOptions.length){
            return setError('You cannot have duplicate options.')
        }

        const limit_IP = limitIP === "yes"

        // replace with in-built max value
        let expiry = 99999999999999;

        const m = 1000 * 60
        const h = m * 60
        const d = h * 24


        if(expiryDate === "10m"){
            expiry = Date.now() + (m * 10)
        } else if(expiryDate === "1h"){
            expiry = Date.now() + h
        } else if(expiryDate === "1d"){
            expiry = Date.now() + d
        } else if(expiryDate === "1w"){
            expiry = Date.now() + (d * 7)
        } else if(expiryDate === "1mo"){
            expiry = Date.now() + (d * 30)
        }

        const pollData = {
            title: title.trim(), options: filteredOptions, limit_IP, expiry
        }

        const API_URI = process.env.REACT_URI || "http://localhost:8080"

        axios.post(`/api/poll`, pollData).then(res => {
            if(res.data.status !== "success"){
                return setError("Unable to create poll.")
            } else {
                // redirect to poll page
                window.location.href = `/${res.data.data.id}`
            }
        }).catch(() => {
            setError("Unable to create poll.")
        })
    }

    return (
        <div>
            <header>
            <h5>Poll Title</h5>
            <input type = "text" placeholder = "Type your question here...." value = {title} onChange = {e => setTitle(e.target.value)} />
            <br />
            <h5>Options</h5>
            {renderOptions()}
            <button onClick={addOption}>+ Add option</button>


            <h5>Settings</h5>
            <label>Limit votes per IP:</label>
            <select name="limit_IP" id ="limit_IP" value = {limitIP} onChange={e => setLimitIP(e.target.value)}>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>

            <label>Expiry Time:</label>
            <select name="expiry" id ="expiry" value = {expiryDate} onChange={e => setExpiryDate(e.target.value)}>
                <option value="never">Never</option>
                <option value="10m">10 minutes</option>
                <option value="1h">1 hour</option>
                <option value="1d">1 day</option>
                <option value="1w">1 week</option>
                <option value="1mo">1 month</option>
            </select>
            <button onClick={handleSubmit}>Create poll</button>
            </header>

            {error &&
                <p>{error}</p>
            }
        </div>
    )
}

export default Home;
