export default function IngredientDetails({
  img,
  name,
  calories,
  proteins,
  fat,
  carbohydrates,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 100px 60px 100px",
      }}
    >
      <img src={img} alt={name} />
      <p
        className="text text_type_main-medium mt-4"
        style={{ textAlign: "center", whiteSpace: "nowrap" }}
      >
        {name}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
        className="mt-8"
      >
        <div style={{ textAlign: "center" }}>
          <p className="text text_type_main-default text_color_inactive">
            Калории,ккал
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {calories}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p className="text text_type_main-default text_color_inactive">
            Белки, г
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {proteins}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p className="text text_type_main-default text_color_inactive">
            Жиры, г
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {fat}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {carbohydrates}
          </p>
        </div>
      </div>
    </div>
  );
}
