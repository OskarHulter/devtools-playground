import type { GetServerSidePropsContext } from "next";

import { getServerSession } from "@sln/features/auth/lib/getServerSession";
import { getDeploymentKey } from "@sln/features/ee/deployment/lib/getDeploymentKey";
import prisma from "@sln/prisma";
import { UserPermissionRole } from "@sln/prisma/enums";

import { ssrInit } from "@server/lib/ssr";

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { req } = context;

	const ssr = await ssrInit(context);
	const userCount = await prisma.user.count();

	const session = await getServerSession({ req });

	if (session?.user.role && session?.user.role !== UserPermissionRole.ADMIN) {
		return {
			redirect: {
				destination: `/404`,
				permanent: false,
			},
		};
	}

	const deploymentKey = await prisma.deployment.findUnique({
		where: { id: 1 },
		select: { licenseKey: true },
	});

	// Check existant sln_LICENSE_KEY env var and acccount for it
	if (!!process.env.sln_LICENSE_KEY && !deploymentKey?.licenseKey) {
		await prisma.deployment.upsert({
			where: { id: 1 },
			update: {
				licenseKey: process.env.sln_LICENSE_KEY,
				agreedLicenseAt: new Date(),
			},
			create: {
				licenseKey: process.env.sln_LICENSE_KEY,
				agreedLicenseAt: new Date(),
			},
		});
	}

	const isFreeLicense = (await getDeploymentKey(prisma)) === "";

	return {
		props: {
			trpcState: ssr.dehydrate(),
			isFreeLicense,
			userCount,
		},
	};
}
