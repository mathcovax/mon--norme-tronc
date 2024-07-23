<script setup lang="ts">
const currentYear = ref(new Date().getFullYear());

const {
	EDITO_HOME,
	EDITO_CGU,
	EDITO_CGV,
	EDITO_PRIVACY_POLICY,
	EDITO_DELIVERY_DETAILS,
	EDITO_RETURN_POLICY,
	EDITO_FAQ_ACCOUNT,
	EDITO_FAQ_PAYMENTS,
	EDITO_FAQ_COMMANDES,
	CATEGORIES_PAGE
} = routerPageName;
</script>

<template>
	<footer class="py-10 lg:py-16 bg-whiteless">
		<div>
			<div class="container flex flex-col lg:flex-row gap-16 lg:gap-0 justify-between">
				<div class="flex flex-col gap-6">
					<RouterLink
						:to="{ name: EDITO_HOME }"
						class="text-2xl font-bold"
					>
						MET
					</RouterLink>

					<p>{{ $t("layout.default.footer.slogan") }}</p>

					<nav>
						<ul class="flex gap-3">
							<li>
								<RouterLink to="#">
									<TheIcon
										icon="twitter"
										size="3xl"
									/>
								</RouterLink>
							</li>

							<li>
								<RouterLink to="#">
									<TheIcon
										icon="facebook"
										size="3xl"
									/>
								</RouterLink>
							</li>

							<li>
								<RouterLink to="#">
									<TheIcon
										icon="instagram"
										size="3xl"
									/>
								</RouterLink>
							</li>

							<li>
								<RouterLink to="#">
									<TheIcon
										icon="youtube"
										size="3xl"
									/>
								</RouterLink>
							</li>
						</ul>
					</nav>
				</div>

				<div class="flex flex-col lg:flex-row gap-16">
					<div class="flex flex-col gap-6">
						<h6 class="text-lg font-semibold uppercase">
							{{ $t("layout.default.footer.helpNav.title") }}
						</h6>

						<nav>
							<ul class="flex flex-col gap-6 opacity-60">
								<li>
									<RouterLink to="#">
										{{ $t("layout.default.footer.helpNav.clientSupport") }}
									</RouterLink>
								</li>

								<li>
									<RouterLink :to="{ name: EDITO_DELIVERY_DETAILS }">
										{{ $t("layout.default.footer.helpNav.deliveryDetails") }}
									</RouterLink>
								</li>

								<li>
									<RouterLink :to="{ name: EDITO_RETURN_POLICY }">
										{{ $t("layout.default.footer.helpNav.returnPolicy") }}
									</RouterLink>
								</li>

								<li>
									<RouterLink :to="{ name: EDITO_CGU }">
										{{ $t("layout.default.footer.helpNav.generalConditions") }}
									</RouterLink>
								</li>

								<li>
									<RouterLink :to="{ name: EDITO_CGV }">
										{{ $t("layout.default.footer.helpNav.termsOfSales") }}
									</RouterLink>
								</li>

								<li>
									<RouterLink :to="{ name: EDITO_PRIVACY_POLICY }">
										{{ $t("layout.default.footer.helpNav.confidentialityPolicy") }}
									</RouterLink>
								</li>
							</ul>
						</nav>
					</div>

					<div class="flex flex-col gap-6">
						<h6 class="text-lg font-semibold uppercase">
							{{ $t("layout.default.footer.faqNav.title") }}
						</h6>

						<nav>
							<ul class="flex flex-col gap-6 opacity-60">
								<li>
									<RouterLink :to="{ name: EDITO_FAQ_ACCOUNT }">
										{{ $t("layout.default.footer.faqNav.account") }}
									</RouterLink>
								</li>

								<li>
									<RouterLink :to="{ name: EDITO_FAQ_PAYMENTS}">
										{{ $t("layout.default.footer.faqNav.payements") }}
									</RouterLink>
								</li>

								<li>
									<RouterLink :to="{ name: EDITO_FAQ_COMMANDES }">
										{{ $t("layout.default.footer.faqNav.orders") }}
									</RouterLink>
								</li>
							</ul>
						</nav>
					</div>

					<div class="flex flex-col gap-6">
						<h6 class="text-lg font-semibold">
							{{ $t("layout.default.footer.pageNav.title") }}
						</h6>

						<nav>
							<ul class="flex flex-col gap-6 opacity-60">
								<li>
									<RouterLink to="/">
										{{ $t("layout.default.footer.pageNav.home") }}
									</RouterLink>
								</li>

								<li>
									<RouterLink :to="{ name: CATEGORIES_PAGE }">
										{{ $t("layout.default.footer.pageNav.products") }}
									</RouterLink>
								</li>

								<li>
									<RouterLink to="#">
										{{ $t("layout.default.footer.pageNav.new") }}
									</RouterLink>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</div>

			<div class="container">
				<hr class="h-px my-6 border-0 bg-black opacity-10">

				<span class="opacity-60">Mon Énorme Tronc &#169; 2024-{{ currentYear }}. {{ $t("layout.default.footer.copyrights") }}</span>
			</div>
		</div>
	</footer>
</template>
