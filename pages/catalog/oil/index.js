import Item from "../../../components/item";
import { sessionOptions } from "../../../constants";
import { withIronSessionSsr } from "iron-session/next";
import cart from "../../../middleware/cart";

const composition = [
  "Оранические масла какао, ши, зародышей пшеницы, жожоба",
  "Цетиол ультимэйт",
  "Витамин Е",
  "Арома композиция",
];

export default function Oil({ cart }) {
  return (
    <Item
      id="oil"
      cart={cart}
      composition={composition}
      colorStart="#4874ff"
      colorStop="#ff00ff"
    >
      Уникальный коктейль органических жирных и&nbsp;эфирных масел высшего
      качества в&nbsp;комплексном уходе за&nbsp;областью бровей и&nbsp;лицом.
      Пластичная структура обусловлена специально подобранным сочетанием
      компонентов (не&nbsp;имеет аналогов), что позволяет средству таять
      непосредственно при нанесении на&nbsp;лицо. Уникальный состав имеет
      идеальную впитываемость, что сохранит вашу кожу нежирной. Восстанавливает
      стуктуру кожи и&nbsp;волос (бровей) насыщая, необходимыми для здорового
      внешнего вида, компонентами. Рекомендуеся применять, как основу для
      нанесения макияжа, что позволит избежать обезвоживания минеральными
      пигментами, а&nbsp;также исключить видимые дефекты при нанесении
      декоративной косметики. Универсальное средство с&nbsp;небольшим расходом,
      отличной органолептикой, приятной стоимостью и&nbsp;потрясающим ощущением
      на&nbsp;коже.
    </Item>
  );
}

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);
