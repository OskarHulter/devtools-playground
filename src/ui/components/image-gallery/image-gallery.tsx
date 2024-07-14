import React from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";

import NextJsImage from "@/ui/components/nextjs-image";

import image1 from "@sln/public/images/next.svg";
import image2 from "@sln/public/images/next.svg";
import image3 from "@sln/public/images/next.svg";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

function ImageGallery() {
	const [open, setOpen] = React.useState(false);
	if (NextJsImage === null) return null;
	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				Open Lightbox
			</button>
			<Lightbox
				open={open}
				close={() => setOpen(false)}
				slides={[
					image1,
					image2,
					image3,
					{
						src: "/image1x3840.jpg",
						alt: "image 1",
						width: 3840,
						height: 2560,
						srcSet: [
							{ src: "/image1x320.jpg", width: 320, height: 213 },
							{ src: "/image1x640.jpg", width: 640, height: 427 },
							{ src: "/image1x1200.jpg", width: 1200, height: 800 },
							{ src: "/image1x2048.jpg", width: 2048, height: 1365 },
							{ src: "/image1x3840.jpg", width: 3840, height: 2560 },
						],
					},
				]}
				// @ts-expect-error
				render={{ slide: NextJsImage, thumbnail: NextJsImage }}
				plugins={[Thumbnails]}
			/>
		</>
	);
}

export default ImageGallery;
