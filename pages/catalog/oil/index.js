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
      идеальную впитываемость,что сохранит важу кожу нежирной. Восстанавливает
      стуктуру кожи и&nbsp;волос (бровей) насыщая, необходимыми для здорового
      внешнего вида, компонентами. Также сриедство рекомендуется использовать,
      как основу под макияж, что позволить сохранить
      её&nbsp;от&nbsp;обезвоживания минеральными пигментами и&nbsp;исключить
      видимые дефекты нанесения декоративной косметики на&nbsp;поверхность кожи,
      а&nbsp;также просто необходимо при нанесении грима. Универсальное средство
      с&nbsp;минимальным расходом и&nbsp;очень приятной стоимостью для
      косметички каждой женщины.
    </Item>
  );
}

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);