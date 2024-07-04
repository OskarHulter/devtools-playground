import "@/styles/globals.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";

export default function NumberList() {
	const [parent, enableAnimations] = useAutoAnimate();

	const [items, setItems] = React.useState([0, 1, 2]);
	const add = () => setItems([...items, items.length]);
	return (
		<>
			<ul ref={parent}>
				{items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
			<button type="button" onClick={add}>
				Add number
			</button>
			<button type="button" onClick={() => enableAnimations(false)}>
				Disable
			</button>
		</>
	);
}
