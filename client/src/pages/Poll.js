import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from 'axios';
import cookies from 'react-cookies';


const Poll = () => {

    // manage state using useState
    const [title, setTitle] = useState("Loading....")
    const [options, setOptions] = useState([])
    const [optionHover, setOptionHover] = useState([])

    // numeric data
    const [totalVotes, setTotalVotes] = useState(0)
    const [maxVotes, setMaxVotes] = useState(0)
    const [userVotedOn, setUserVotedOn] = useState(-1)
    const [expiry, setExpiry] = useState(0)

    let {id} = useParams()

    const fetchResults = async () => {
        const API_URI = process.env.REACT_URI

        axios.get(`${API_URI}/poll/${id}`).then(res => {
            const data = res.data.data;
            setTitle(data.title);
            setExpiry(data.expiry);

            const voteData = data.options.map(option => ({title: option, votes: 0}))

            data.votes.forEach(vote => {
                const option = voteData.find(option => option.title === vote.option)
                option.votes = parseInt(vote.vote_count)
            });

            setOptions(voteData)

            setOptionHover(voteData.map(() => false))

            let total = 0
            let max = 0

            voteData.forEach(option => {
                total += option.votes;
                if(option.votes > max){
                    max = option.votes;
                }
            })

            setTotalVotes(total)
            setMaxVotes(max)
        }).catch(() => {})
    }

    useEffect(() => {
        // fetch vote from cookie if voted already
        const userVoteChoice = cookies.load(id)

        if(userVoteChoice){
            setUserVotedOn(parseInt(userVoteChoice))
        }

        fetchResults()

        // fetch results every 2 seconds
        const interval = setInterval(() => fetchResults(), 2000)

        return () => clearInterval(interval)
    }, [])

    const handleOptionHover = (index, hover) => {
        let newOptionHover = [...optionHover]
        newOptionHover[index] = hover
        setOptionHover(newOptionHover)
    }

    const calculateResultWidth = (votes, totalVotes) => {
        const pct = ((votes / totalVotes) * 100) | 0;
        console.info(votes, totalVotes, pct);
        return pct < 7 ? `0%` : `${pct}%`;
      };

    const handleOptionClick = index => {
        // if already voted, do nothing
        if(userVotedOn !== -1) return;

        setUserVotedOn(index)
        cookies.save(id, `${index}`)

        const newOptions = [...options]
        newOptions[index].votes++
        setOptions(newOptions)

        let total = 0
        let max = 0

        newOptions.forEach(option => {
            total += option.votes;
            if(option.votes > max){
                max = option.votes;
            }
        })

        setTotalVotes(total)
        setMaxVotes(max)

        const API_URI = process.env.REACT_URI

        axios.put(`${API_URI}/poll/${id}/vote`, {option: options[index].title}).then(() => fetchResults()).catch(() => {})
    }

    const renderExpiry = () => {
        let now = new Date();
        let expiryDate = new Date(parseInt(expiry))

        let hours = Math.floor((expiryDate - now)/(3600 * 1000))
        let minutes = Math.floor((expiryDate - now)/60000) % 60
        let seconds = Math.floor((expiryDate - now)/1000) % 60

        let formattedTime = `${hours}h ${minutes}m ${seconds}s`
        if(hours > 864000) formattedTime = 'Never';
        if(expiryDate - now < 0) formattedTime = 'Expired';

        return <p>Expires: {formattedTime}</p>
    }

    const renderOptions = () => {
        return options.map((option, index) => {
            return (
                <div
                className = "pollOption"
                key = {index}
                onMouseEnter = {() => handleOptionHover(index, true)}
                onMouseLeave = {() => handleOptionHover(index, false)}
                onClick={() => handleOptionClick(index)}>

                    <span className = "pollOptionText" style = {{
                        color: userVotedOn > -1 && option.votes === maxVotes && maxVotes > 0 ? "#fff": "#050505",
                        fontWeight: userVotedOn > -1 && option.votes === maxVotes && maxVotes > 0 ? "bold": "normal",
                    }}>{option.title}</span>
                    {console.info(option, maxVotes, totalVotes, option.votes / totalVotes)}


                    {userVotedOn > -1 && (
                        <>
                        <span
                            style={{
                            color:
                                userVotedOn > -1 && option.votes === maxVotes && maxVotes > 0
                                ? '#57ff57'
                                : '#050505',
                            fontWeight:
                                userVotedOn > -1 && option.votes === maxVotes && maxVotes > 0
                                ? 'bold'
                                : 'normal',
                            }}
                            className='pollOptionVotes'
                        >
                            {option.votes.toLocaleString()}
                        </span>

                        <div
                            className={option.votes === maxVotes ? 'voteFill' : 'emptyFill'}
                            style={{
                            width: calculateResultWidth(option.votes, totalVotes),
                            }}
                        />
                        </>
                    )}
                </div>
            )
        })
    }

    return(
        <div>
            <h2>{title}</h2>
            <br></br>
            {renderOptions()}
            <br></br>
            {renderExpiry()}
        </div>
    )
}

export default Poll;
