import  {ChangeEvent, memo, useState} from "react";

type SpanInputFormType = {
    title: string
    callBack: (newValue: string) => void
}
export const SpanInputForm = memo((props: SpanInputFormType) => {
    const [spanClick, setSpanClick] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState<string>('')
    const onClickOn = () => {
        setSpanClick(true)
    }
    const onClickOff = () => {
        setSpanClick(false)
        props.callBack(newTitle)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    return (
        spanClick ?
            <input type={"text"} value={newTitle} onBlur={onClickOff} autoFocus onChange={onChangeHandler}/> :
            <span onDoubleClick={onClickOn}>{props.title}</span>
    )
})