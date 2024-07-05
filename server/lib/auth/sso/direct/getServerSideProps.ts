import { samlProductID, samlTenantID } from "@sln/features/ee/sso/lib/saml";

export async function getServerSideProps() {
	return {
		props: {
			samlTenantID,
			samlProductID,
		},
	};
}
