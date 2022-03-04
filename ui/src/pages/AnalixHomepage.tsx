import React, {useState} from 'react';
// @ts-ignore
import logo_image from '../imgs/logo.png'
import styled from 'styled-components'

interface ApiResponse{
    label:string;
    human_readable_label:string;
    message:string;
}

interface ApiRequestBody{
    text:string;
}

const AnalixHomePage = () => {

    const introText="Simply input your text and we will scan it for sensitive content.\n Please note that this application in only for demonstrative purposes of the capability of openai models and is limited to english text"

    const [text,setText]=useState("")
    const [loading,setLoading]=useState(false)
    const [textInfo,setTextInfo]=useState<ApiResponse|null>(null)


    const make_request = async () =>{
        if (!text){
            alert("please provide some text before scanning")
            return;
        }
        setLoading(true)
        const body:ApiRequestBody = {
            "text":text
        };
        const response = await fetch('http://localhost:8000/api/sensitivity', {
            method: "POST",
            body: JSON.stringify(body),
        });

        if (response.status === 200){
            const info = await response.json()
            setTextInfo(info as ApiResponse)
            console.log(info)

        }else{
            alert("something went wrong, please try again later")
        }
        setLoading(false)
    }


    return (
    <AnalixHomePageArea>
        <IntroArea>
            <Logo src={logo_image} alt="Analix logo"/>
            <IntroText>
                {introText}
            </IntroText>
        </IntroArea>
        <InputArea>
            <AnalixTextArea 
            placeholder="your text"
            value={text}
            onChange={(e)=>setText(e.target.value)}
            onSubmit={() => make_request()}
            />
            <AnalixScanButton onClick={()=>make_request()}>
                Scan
            </AnalixScanButton>
        </InputArea> 
        {!loading && textInfo && (
            <AnalixResponseArea label={textInfo.label}>
                <AnalixResponseText><b>Scam Result</b></AnalixResponseText>
                <AnalixResponseText>label:{textInfo.human_readable_label}</AnalixResponseText>
                <AnalixResponseText>{textInfo.message}</AnalixResponseText>
            </AnalixResponseArea>
        )}
    </AnalixHomePageArea>
    )
}

const AnalixHomePageArea=styled.div`
    min-height:100vh;
    background: linear-gradient(180deg, #F9FEF3 0%, #F8EFF5 100%);
`

const IntroArea = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap:wrap;
    padding:5rem 0;
`

const InputArea = styled.div`
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
    margin:0 20px;
`

const Logo = styled.img`
    display:flex;
    width:30vw;
    max-width:400rem;
    min-width:25rem;

`

const IntroText = styled.p`
    text-align: justify;
    font-size: 1.5rem;
    max-width:40vw;
    padding:1.2rem;

    @media only screen and (max-width: 600px) {
        max-width:80vw;
        text-align: center;

    }
`

const AnalixScanButton = styled.button`
    border:1px solid black;
    padding:1 rem;
    margin:1rem;
    width:5rem;
    height:2rem;
    backgrond:rgba(249, 254, 243, 1);
    cursor:pointer;
`

const AnalixTextArea = styled.textarea`
    text-align: left;
    width:80%;
    font-size:1.1rem;
`

interface AnalixResponseAreaProps{
    label:string;
}
const AnalixResponseText = styled.p`
    text-align:center;
    max-width:60vw;
    margin:0.5rem auto;
    
`

const AnalixResponseArea = styled.div<AnalixResponseAreaProps>`
    ${(props) => (props.label==="0" ? 'color:green;' : '')}
    ${(props) => (props.label==="1" ? 'color:purple;' : '')}
    ${(props) => (props.label==="2" ? 'color:red;' : '')}
    ${(props) => (props.label!=="2" && props.label!=="1" && props.label!=="0" ? 'color:black;' : '')}
    text-decoration:bold;
    width:100%;
    font-size:1.2rem;
`
export default AnalixHomePage