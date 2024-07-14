import { getReviewWithResponses } from "./get-review";

import getUserReview from "./getUserReview";

const getReviewInfo = async (uid: string) => {
	const reviewInfoRaw = await getUserReview(uid);

	if (!reviewInfoRaw) {
		return { reviewInfoRaw: undefined, reviewInfo: undefined };
	}

	const reviewInfo = getReviewWithResponses(reviewInfoRaw);

	return { reviewInfoRaw, reviewInfo };
};

export default getReviewInfo;
