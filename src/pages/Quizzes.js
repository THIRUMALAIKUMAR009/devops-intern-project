import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { addQuizzes, deleteQuizzes, getQuizzes, updateQuizzes } from "./API"

function Quizzes()
{
    const [questions,setQue] = useState([])
    const [loader,setLoader] = useState(false)
    const [update,setUpdate] = useState(false)
    const [data,setdata] = useState()
    const navigate = useNavigate()
    const location = useLocation()
    const {role} = location.state
    const id = useRef()
    const title = useRef()
    const description = useRef()
    const update_id = useRef()
    const update_title = useRef()
    const update_description = useRef()
    useEffect(() =>{
        fetchQuiz()
    },[])

    const fetchQuiz = () => {
        setLoader(true)
        getQuizzes().then(data => {
            // console.log(res.data)
            setQue(data)
            setLoader(false)
        }).catch(error => alert(error))
    }

    const submit = (event) => {
        event.preventDefault()
        setQue([])
        setLoader(true)
        const input = {
            course_id:id.current.value,
            quiz_title:title.current.value,
            quiz_description:description.current.value
        }
        // console.log(input)
        addQuizzes(input).then(data => fetchQuiz())
        .catch(err => console.error(err))
    }

    const updatefn = (event) =>{
        event.preventDefault()
        setUpdate(false)
        setQue([])
        setLoader(true)
        const input = {
            old_quiz_id:data.quiz_id,
            quiz_id:data.quiz_id,
            course_id:update_id.current.value,
            quiz_title:update_title.current.value,
            quiz_description:update_description.current.value
        }
        updateQuizzes(input).then(data => {
            fetchQuiz()
        })
        .catch(err => console.error(err))
    }

    const deletefn = (question) => {
        setQue([])
        setLoader(true)
        const status = window.confirm("Are you sure want to delete ?")
        if(status)
        {
            deleteQuizzes(question.quiz_id).then(data => fetchQuiz())
            .catch(err => console.error(err))
        }
    }
    return (
        <>
            <div className="quizpage">
            {update && <div className="update">
                <form className=" admin-form Modal" onSubmit={updatefn}>
                <span className="close" onClick={() => (setUpdate(false))}>x</span>
                    <input type="text" ref={update_id} placeholder="course id" required/>
                    <input type="text" ref={update_title} placeholder="quiz title" required/>
                    <input type="text" ref={update_description} placeholder="quiz description" required/><br/>
                    <input type="submit" value="Update"/>
                </form>
            </div>}
            {role !== 'Student' && <form className="admin-form" onSubmit={submit}>
                        <input type="text" ref={id} placeholder="course id" required/>
                        <input type="text" ref={title} placeholder="quiz title" required/>
                        <input type="text" ref={description} placeholder="quiz description" required/>
                        <input type="submit" value="+"/>
                    </form>}
                {questions.length > 0 && <h1 className="heading">Practice quiz</h1>}
                <div className="quizpage">
                    {loader && <div className="loader"/>}
                    {questions.length > 0 && questions.map((question,index)=>{
                        return(
                            <>
                                <div className="ques quiz" key={index}>
                                    <span className="title" onClick={() => {navigate(`/main/quiz/${question.quiz_id}`)}}>{index+1}. {question.quiz_title}</span>
                                    <p>{question.quiz_description}</p>
                                    <div className="edit">
                                        {role !== 'Student' && <input type="button" className="updatebtn" value="update" onClick={async() => {
                                            setUpdate(true)
                                            setdata(question)
                                        }}/>}
                                        {role !== 'Student' && <input type="button" className="deletebtn" value="Delete" onClick={() => {
                                            deletefn(question)
                                        }}/>}
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Quizzes