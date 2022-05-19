import Item from "../../../components/item";
import { sessionOptions } from "../../../constants";
import { withIronSessionSsr } from "iron-session/next";
import cart from "../../../middleware/cart";

const composition = [
  "Кофе арабика",
  "Розовая соль",
  "Морская соль",
  "Масло миндальное",
  "Масло жожоба",
  "Цетиол ультимэйт",
  "Витамин Е",
  "Арома композиция",
];

export default function Oil({ cart }) {
  return (
    <Item
      id="scrub"
      cart={cart}
      composition={composition}
      colorStart="#59fca6"
      colorStop="#cc09e0"
    >
      Превосходный мелкодисперсный скраб-паста для губ и&nbsp;бровей отлично
      эксфолиирует отмершие частички кожи, а&nbsp;также стимулирует процессы
      регенерации, питает и&nbsp;насыщает микроэлементами и&nbsp;маслами.
      В&nbsp;приготовлении скраба используются только натуральные, зелёные
      компоненты, такие как кофе арабика, гималайская и&nbsp;эпсомская соли,
      а&nbsp;также натуральные масла жожоба, зародышей пшеницы, корн
      и&nbsp;сладкого миндаля, что в&nbsp;сочетании с&nbsp;органическими
      эфирными маслами делает скраб незаменимым средством в&nbsp;уходе
      за&nbsp;кожей. Пастообразная структура экономит расход, а&nbsp;процесс
      скрабирования становится удобным. После применения скраба рекомендуется
      нанести бальзам для бровей и&nbsp;бальзам для губ L&amp;B
      на&nbsp;обработанные зоны лица.
    </Item>
  );
}

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);
