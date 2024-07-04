import Image from "next/image";
import type { ReactElement } from "react";
import {
	isImageFitCover,
	isImageSlide,
	useLightboxProps,
	useLightboxState,
} from "yet-another-react-lightbox";
import type {
	RenderFunction,
	RenderSlideProps,
	RenderThumbnailProps,
	Slide,
} from "yet-another-react-lightbox";

function isNextJsImage(slide: Slide): boolean {
	return (
		isImageSlide(slide) &&
		typeof slide.width === "number" &&
		typeof slide.height === "number"
	);
}

export type NextJsImageProps = {
	shouldUseBlur?: boolean;
};

export default function NextJsImage({
	slide,
	offset,
	rect,
	shouldUseBlur,
}: RenderSlideProps & NextJsImageProps & RenderFunction<RenderThumbnailProps>) {
	const {
		on: { click },
		carousel: { imageFit },
	} = useLightboxProps();

	const { currentIndex } = useLightboxState();

	const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

	if (!isNextJsImage(slide)) return <> </>;
	if (!slide.width || !slide.height) return <> </>;

	const width = !cover
		? Math.round(
				Math.min(rect.width, (rect.height / slide.height) * slide.width),
			)
		: rect.width;

	const height = !cover
		? Math.round(
				Math.min(rect.height, (rect.width / slide.width) * slide.height),
			)
		: rect.height;

	return (
		<div style={{ position: "relative", width, height }}>
			<Image
				fill
				alt=""
				src={slide.src}
				loading="eager"
				draggable={false}
				placeholder={shouldUseBlur ? "blur" : undefined}
				style={{
					objectFit: cover ? "cover" : "contain",
					cursor: click ? "pointer" : undefined,
				}}
				sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
				onClick={
					offset === 0 ? () => click?.({ index: currentIndex }) : undefined
				}
			/>
		</div>
	);
}
