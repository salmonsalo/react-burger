import done from "../../images/done.svg";
export default function OrderDetails() {
    return (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", padding:"0 100px 100px 100px"}}>
            <h2 className="text text_type_digits-large mt-20 mb-8">034536</h2>
            <p className="text text_type_main-medium">идентификатор заказа</p>
            <img className="mt-15 mb-15" src={done} alt="идентификатор заказа" />
            <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
            <p className="text text_type_main-default text_color_inactive mb-5">Дождитесь готовности на орбитальной станции</p>
        </div>
    )
}