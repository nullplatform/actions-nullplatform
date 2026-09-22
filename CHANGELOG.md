# Changelog

## [1.6.3](https://github.com/nullplatform/actions-nullplatform/compare/v1.6.2...v1.6.3) (2026-09-22)


### Bug Fixes

* **ci:** the digest also lists bot PRs merged or closed since the last one ([febea4b](https://github.com/nullplatform/actions-nullplatform/commit/febea4b7617c9b238a9603f34ddf838abd00b744))
* **ci:** the digest also lists bot PRs merged or closed since the last one ([5a74dd3](https://github.com/nullplatform/actions-nullplatform/commit/5a74dd3d341534b1c7b437f587525ed4964c1aca))

## [1.6.2](https://github.com/nullplatform/actions-nullplatform/compare/v1.6.1...v1.6.2) (2026-09-22)


### Bug Fixes

* **ci:** unblock bot commits, track the fluent-bit pin, and fix two blind spots in the digest ([e28db41](https://github.com/nullplatform/actions-nullplatform/commit/e28db41000224e0fcb04782d3368e3c795fc6c01))
* **renovate:** keep the AMI's fluent-bit on the line its compiled plugin supports ([bd00112](https://github.com/nullplatform/actions-nullplatform/commit/bd001124fee15d00662b541640f039343edf40ac))
* **renovate:** stop the cloudwatch plugin from moving without its binary ([a2e7f84](https://github.com/nullplatform/actions-nullplatform/commit/a2e7f8463b6fef8ec7c2f35d055bd18bad1b43d7))

## [1.6.1](https://github.com/nullplatform/actions-nullplatform/compare/v1.6.0...v1.6.1) (2026-09-21)


### Bug Fixes

* **ci:** call the tofu workflows through the path form ([3ff11c0](https://github.com/nullplatform/actions-nullplatform/commit/3ff11c018f69ae1c23895aa342c88114eedc3d4c))
* **ci:** internal references resolved to main and leaked the caller's pin ([e0eb7b6](https://github.com/nullplatform/actions-nullplatform/commit/e0eb7b6cde8615c07da5f7b3840486f1f05919f2))
* **ci:** keep the shared CI standard from drifting ([8c7af5c](https://github.com/nullplatform/actions-nullplatform/commit/8c7af5c523ff0c43b7f01edb54192d6137c7573b))
* **ci:** pin run-first to the major tag so a pinned caller does not run main ([0954d9b](https://github.com/nullplatform/actions-nullplatform/commit/0954d9b3a0a6e08fc9d2a3ba987d033459b51715))
* **ci:** pin run-first to the major tag so a pinned caller does not run main ([63c5be4](https://github.com/nullplatform/actions-nullplatform/commit/63c5be4533872c6445781c76fb7b1dce72559797))
* **deps:** bump the github-actions group across 1 directory with 4 updates ([30770e7](https://github.com/nullplatform/actions-nullplatform/commit/30770e7128c596f42358e1133d48cd14abc9a9b6))
* **release:** don't leak gh api error bodies into release/artifact data ([2f48440](https://github.com/nullplatform/actions-nullplatform/commit/2f48440845448aa2bbecfd2675c7e484dabfeb43))
* **release:** don't leak gh api error bodies into release/artifact data ([62bb3d0](https://github.com/nullplatform/actions-nullplatform/commit/62bb3d086c05c73beccf2f087bd3661a4a1221a9))

## [1.6.0](https://github.com/nullplatform/actions-nullplatform/compare/v1.5.0...v1.6.0) (2026-09-21)


### Features

* **pr-checks-node-pnpm:** opt-in changed-since, shard and lint inputs ([52d68b6](https://github.com/nullplatform/actions-nullplatform/commit/52d68b64ed37a4d5c36c5c33d423775b011f9783))
* publish test images from branches with publish-test-image-oci ([da34862](https://github.com/nullplatform/actions-nullplatform/commit/da34862aef7b79bcaf0d308daf3ed5e9706a262b))
* **publish-test-image-oci:** register test builds on the release artifact ([c4e03b1](https://github.com/nullplatform/actions-nullplatform/commit/c4e03b1c19147e39acaad6c21b962507686e0014))
* **publish-test-image-oci:** register test builds on the release artifact ([cc7c2dd](https://github.com/nullplatform/actions-nullplatform/commit/cc7c2dde811ccdb6a4baa4de782b47bc15839b2a))


### Bug Fixes

* **ci:** mint both App tokens with client-id ([7987a0c](https://github.com/nullplatform/actions-nullplatform/commit/7987a0c465849439684d40ef0f5afe4a18444e41))
* **ci:** mint the App token with client-id, app-id is deprecated ([09c8a0f](https://github.com/nullplatform/actions-nullplatform/commit/09c8a0f2091585643b4efa02d521454486195d6c))
* **ci:** mint the App tokens with client-id instead of the deprecated app-id ([6970511](https://github.com/nullplatform/actions-nullplatform/commit/6970511fb221422f42fb27b9fa6391e82a72c6e4))
* **ci:** the guard checks the private key, not the app id ([0a3d28d](https://github.com/nullplatform/actions-nullplatform/commit/0a3d28da7ead216a068085f6057a1bc022cd5a84))

## [1.5.0](https://github.com/nullplatform/actions-nullplatform/compare/v1.4.0...v1.5.0) (2026-09-18)


### Features

* **ci:** conformance also checks the release App reaches the repo ([977f980](https://github.com/nullplatform/actions-nullplatform/commit/977f980314405fe22f8c0cf68be4d3d31aa82c07))
* **ci:** valkey back in the digest; release-conformance section for public scopes-*/services-* ([d8ffd21](https://github.com/nullplatform/actions-nullplatform/commit/d8ffd21ccdaf090bd8d0513cbadcbbe2d8791acd))
* **renovate:** extend dependency coverage ([622badc](https://github.com/nullplatform/actions-nullplatform/commit/622badcd695a100009d98fd7786e7252bde7b3df))
* **renovate:** extend dependency coverage ([30f37a6](https://github.com/nullplatform/actions-nullplatform/commit/30f37a6a43b85ff306c0c1a0b2f0a8c38907917f))
* **renovate:** let Renovate maintain its own version and the actions of this repo ([9bb197c](https://github.com/nullplatform/actions-nullplatform/commit/9bb197c08eb8ad23798dd8dff405970d9f520245))
* **renovate:** replace the in-house bumper with self-hosted Renovate ([01e2581](https://github.com/nullplatform/actions-nullplatform/commit/01e2581a5895d6ff9a476a88c572226209270427))
* **renovate:** weekly bumps for pinned binaries via self-hosted Renovate ([abb41b5](https://github.com/nullplatform/actions-nullplatform/commit/abb41b590f1550315eb6747695298b707aac56e6))
* **slack:** daily digest of bot PRs waiting for merge ([9770276](https://github.com/nullplatform/actions-nullplatform/commit/9770276bc3e19fae54dbeb6c22da547f1b5cda0b))
* **slack:** daily digest of bot PRs waiting for merge ([65e2553](https://github.com/nullplatform/actions-nullplatform/commit/65e2553780f652d9698035c51341b5b4ccec80e8))
* **vuln-bump:** abrir los PRs y reportar a Slack con los links ([d6bd113](https://github.com/nullplatform/actions-nullplatform/commit/d6bd113fc14d701a0232f62f988c29d7a856d2e2))
* **vuln-bump:** discover the pins instead of declaring them ([4f36fd4](https://github.com/nullplatform/actions-nullplatform/commit/4f36fd4894255039990f121c95a1aaeb4c29520f))
* **vuln-bump:** resolver de bumps minimos seguros, en dry-run ([4147d36](https://github.com/nullplatform/actions-nullplatform/commit/4147d3680e5808d6adb4fbbdc1fbbf7e0fa04ce1))


### Bug Fixes

* **auto-merge:** resolve the release PR on workflow_run and refuse the gated pull_request path ([6677f38](https://github.com/nullplatform/actions-nullplatform/commit/6677f38df1c2301973116c50d1839a1b36162c90))
* **auto-merge:** resolve the release PR on workflow_run and refuse the gated pull_request path ([efdbf2c](https://github.com/nullplatform/actions-nullplatform/commit/efdbf2ca474b0cd26145f330ceebe17305aca36e))
* **ci:** dependabot owns the workflow files so Renovate needs no Workflows permission ([22955fd](https://github.com/nullplatform/actions-nullplatform/commit/22955fd1f6d47ff4499c36b5e96f4d0945543122))
* **ci:** dependabot owns the workflow files, including the renovate action ([8814bd0](https://github.com/nullplatform/actions-nullplatform/commit/8814bd0b6707c104c743bd7a5370c700b8c77c13))
* **ci:** renovate nginx pin and log_level; digest with valkey and release conformance ([a744f80](https://github.com/nullplatform/actions-nullplatform/commit/a744f80a3835cacf18e499561af6dd0e573ef2ad))
* **digest:** biweekly cadence and services-valkey out of scope ([d0726e3](https://github.com/nullplatform/actions-nullplatform/commit/d0726e361d6872764340da362456918f09f76519))
* **digest:** read SLACK_SECURITY_URL and add a dry_run input ([be4fc18](https://github.com/nullplatform/actions-nullplatform/commit/be4fc1833fc79584d4f8bbaf45f2c5ab93fa42d1))
* **digest:** SLACK_SECURITY_URL, biweekly cadence, dry_run, valkey out ([a902385](https://github.com/nullplatform/actions-nullplatform/commit/a90238579ca201388d40175af5ab5c4789a19061))
* **ecr-security-scan:** resolve the tag by version shape + push date ([9577ca7](https://github.com/nullplatform/actions-nullplatform/commit/9577ca7c676d94915c252c32c0b7f02ca3a68f2f))
* **ecr-security-scan:** resolver el tag por forma de versión + fecha de push ([5d8dd2e](https://github.com/nullplatform/actions-nullplatform/commit/5d8dd2ec2476febc4ed28a25c6f4781dd2970c53))
* **renovate:** autodiscover only scopes-*, services-* and the fixed set of image repos ([db3e19f](https://github.com/nullplatform/actions-nullplatform/commit/db3e19fe3ff75d46053efa1ba4bd3930e313624f))
* **renovate:** autodiscover only scopes-*, services-* and the fixed set of image repos ([65f844c](https://github.com/nullplatform/actions-nullplatform/commit/65f844c9f76fe3155e826a94b2d384601f650822))
* **renovate:** branch prefix that passes the org's branch-validation ([bb07631](https://github.com/nullplatform/actions-nullplatform/commit/bb07631814d05b9b19c83cb9edbecc9c14f82119))
* **renovate:** drop the renovate-version pin; the action decides it ([216f96d](https://github.com/nullplatform/actions-nullplatform/commit/216f96d1aa7cb49a383949ef08a8dbf6a3e64146))
* **renovate:** make dry-run actually reach Renovate ([b12482c](https://github.com/nullplatform/actions-nullplatform/commit/b12482cd1db83450c89bb901f4f4ff531346dd56))
* **renovate:** make dry-run reach Renovate; branch prefix that passes branch-validation ([5e13030](https://github.com/nullplatform/actions-nullplatform/commit/5e13030308327f92be29012fc9818cf83c69161d))
* **renovate:** no manager writes under .github/workflows ([0c92f34](https://github.com/nullplatform/actions-nullplatform/commit/0c92f340e35e97bdd0ad6cafbbd5c234599a4605))
* **renovate:** np-nginx base pin moves to its repo config; allow its tag-bump command ([40211d3](https://github.com/nullplatform/actions-nullplatform/commit/40211d342525350f50197db7cb38d224ab0f2699))
* **renovate:** propose Renovate's own major so the self-update does not stall on 44.x ([fa52256](https://github.com/nullplatform/actions-nullplatform/commit/fa522563abca473045eefc3d481843ea35ed202a))
* **renovate:** read the App secrets under the names they were created with ([b7186aa](https://github.com/nullplatform/actions-nullplatform/commit/b7186aaed44217af03ed5f5f5dd563fc81b6de46))
* **renovate:** read the App secrets under the names they were created with ([ad97b26](https://github.com/nullplatform/actions-nullplatform/commit/ad97b262df7fe671f90b3eaa83e6def7a8f98013))
* **renovate:** rebase the nginx pin change on the allowlist ([9d38e37](https://github.com/nullplatform/actions-nullplatform/commit/9d38e37296b9f0031d24e2dac3405be43962e3f8))
* **renovate:** run on the 2nd and 16th, the day after the base image rebuild ([8103626](https://github.com/nullplatform/actions-nullplatform/commit/810362601815917e6627467edc55c35221d71698))
* **renovate:** use the org-level SLACK_SECURITY_WEBHOOK ([ad2e8a6](https://github.com/nullplatform/actions-nullplatform/commit/ad2e8a68787188a41e8b2a82069473ce53a59bb8))
* **vuln-bump:** pass repo-controlled data as argv, never as a shell string ([98ec78f](https://github.com/nullplatform/actions-nullplatform/commit/98ec78fef6b94ebfaf6429a4125b0c34201a9056))
* **vuln-bump:** quoting hacia el shell, aislamiento por repo, rate limit y cache ([04a4443](https://github.com/nullplatform/actions-nullplatform/commit/04a444332d6284fa064d28d48a786ef2a7ce3874))

## [1.4.0](https://github.com/nullplatform/actions-nullplatform/compare/v1.3.2...v1.4.0) (2026-09-14)


### Features

* add reusable auto-merge-release-pr workflow ([ece8904](https://github.com/nullplatform/actions-nullplatform/commit/ece8904e4b7f387805cddf64c42854cb1df688f7))
* add reusable auto-merge-release-pr workflow ([a9ead54](https://github.com/nullplatform/actions-nullplatform/commit/a9ead54378b1ebd4e9b11e7fdb794ee6c291c345))
* chained release-publish-oci workflow + release.yml outputs ([6bab43c](https://github.com/nullplatform/actions-nullplatform/commit/6bab43c2b11d238a08297448b4ddca4a546d3575))
* chained release-publish-oci workflow for service repos ([62f4ed5](https://github.com/nullplatform/actions-nullplatform/commit/62f4ed55964398ce8ef9de309b92a7aad9467bd3))
* **docker-build-push-ecr:** add opt-in also_tag_latest input ([abbc3c6](https://github.com/nullplatform/actions-nullplatform/commit/abbc3c6e8f4349d0b934bb18b3f861201c647320))
* **docker-build-push-ecr:** opt-in also_tag_latest input ([a8e1a6e](https://github.com/nullplatform/actions-nullplatform/commit/a8e1a6e85c93372a1831d51fa272676c80dd12ab))
* **docker-build-push-ecr:** optional submodules checkout ([3788418](https://github.com/nullplatform/actions-nullplatform/commit/3788418c96138314695e865f4bec797a19cfa92f))
* **docker-build-push-ecr:** optional submodules checkout ([8dce282](https://github.com/nullplatform/actions-nullplatform/commit/8dce2823e0ae83756e793f4e1b3c31863934e999))
* **pr-checks-go:** add require-private-modules to fail fast on a missing credential ([44e5f13](https://github.com/nullplatform/actions-nullplatform/commit/44e5f1315fd33310b3684b286d5f206811a9847a))
* **pr-checks-go:** allow resolving private nullplatform Go modules ([f908b50](https://github.com/nullplatform/actions-nullplatform/commit/f908b501ee8aba26cba35ccb2546c7fac74dee3d))
* **pr-checks:** mint a GitHub App token for private dependency access ([73908ff](https://github.com/nullplatform/actions-nullplatform/commit/73908ff43f72f786637102ae33dedb48c1927f29))
* **pr-checks:** resolve private nullplatform Go modules via a GitHub App token ([7cf4b2a](https://github.com/nullplatform/actions-nullplatform/commit/7cf4b2a1b1599c788b802aaf9d7380548de80a4b))
* **release-publish-oci:** publish tag, changelog and OCI annotations ([e96e2f6](https://github.com/nullplatform/actions-nullplatform/commit/e96e2f6f598368697076104c76b2ac9053bae9cd))
* **release-publish-oci:** publish tag, changelog and OCI annotations ([2b0be41](https://github.com/nullplatform/actions-nullplatform/commit/2b0be41b3575f36cd9274a3e4482f5bfcd83a763))
* shellcheck auto-discovers extensionless scripts by shebang ([d36fbfc](https://github.com/nullplatform/actions-nullplatform/commit/d36fbfc81acfbdeb36c0bb1a595f48c24e347075))
* shellcheck auto-discovers extensionless scripts by shebang ([e9bffbc](https://github.com/nullplatform/actions-nullplatform/commit/e9bffbc3edacf7590455d1121db583f8e368b143))
* support explicit pr_number input in auto-merge-release-pr ([618f904](https://github.com/nullplatform/actions-nullplatform/commit/618f9045bac01d75ebb61cea3c358db2d70bf6f7))
* support explicit pr_number input in auto-merge-release-pr ([9c05415](https://github.com/nullplatform/actions-nullplatform/commit/9c05415eafacc5745401b123c6af4123f975867a))


### Bug Fixes

* add DEPENDABOT_TOKEN fallback for Dependabot PR CI runs ([5e062ec](https://github.com/nullplatform/actions-nullplatform/commit/5e062ec1c71284c85609501eedb0d8ec082502c0))
* add DEPENDABOT_TOKEN fallback for Dependabot PR CI runs ([79f4200](https://github.com/nullplatform/actions-nullplatform/commit/79f42007e0afd63e79d95dddd8bbda11ba7e9c97))
* auto-merge-release-pr fails randomly when a release PR has zero checks yet ([2bb005f](https://github.com/nullplatform/actions-nullplatform/commit/2bb005f53b30b742764a616a877bcb44f130c97d))
* **auto-merge-release:** use --admin to bypass base branch policy on merge ([4678465](https://github.com/nullplatform/actions-nullplatform/commit/4678465653e7f2d4a7c70cf7f1f3b5c15481dc92))
* **auto-merge-release:** use --admin to bypass base branch policy on merge ([f3bf16b](https://github.com/nullplatform/actions-nullplatform/commit/f3bf16b4889ef36460c2a35cc34e7fe569c4f295))
* avoid self-deadlock in auto-merge-release-pr ([2d3deeb](https://github.com/nullplatform/actions-nullplatform/commit/2d3deebca2061b87863db06904b8d479ea8b0e4c))
* avoid self-deadlock waiting on the release PR's checks ([0f94afa](https://github.com/nullplatform/actions-nullplatform/commit/0f94afa8d44bf45847ebbb9bcface494fe6e3fa9))
* **branch-validation:** skip validation for dependabot branches ([5c0f5d4](https://github.com/nullplatform/actions-nullplatform/commit/5c0f5d48e2d589568dcd71c7008375e3284b24d7))
* **branch-validation:** skip validation for dependabot branches ([1310eeb](https://github.com/nullplatform/actions-nullplatform/commit/1310eeb3c3042e5e6a30ff94148a47aa2eaf6cdd))
* **docker-build-push-ecr:** build backfills from the tag, not the dispatch branch ([b76f78a](https://github.com/nullplatform/actions-nullplatform/commit/b76f78ac49194c0879b1c2f904a5752305103ad2))
* **docker-build-push-ecr:** build backfills from the tag, not the dispatch branch ([f341e7c](https://github.com/nullplatform/actions-nullplatform/commit/f341e7c34cf13f4dae34e63b04155171d69a2f5f))
* **docker-ecr:** keep prerelease suffix in the published image tag ([0520a07](https://github.com/nullplatform/actions-nullplatform/commit/0520a07e97a3d9ac49761405b08f8f1421a58051))
* **docker-ecr:** keep prerelease suffix in the published image tag ([028ced6](https://github.com/nullplatform/actions-nullplatform/commit/028ced65840ab16071f928c9c6bb7395861c00f8))
* don't hard-fail when a previously-checked PR briefly reports no checks ([4944ab9](https://github.com/nullplatform/actions-nullplatform/commit/4944ab9141412646989a87be14949a2edcd44344))
* **ecr-security-scan:** default upload_sarif to false ([3a6b303](https://github.com/nullplatform/actions-nullplatform/commit/3a6b303790f11b1df537bdd792a6c3a5fc8f595c))
* **ecr-security-scan:** default upload_sarif to false ([3c8ea18](https://github.com/nullplatform/actions-nullplatform/commit/3c8ea18d6ff10ad5373b0feed0c78c36fac27534))
* **ecr-security-scan:** pass inputs via env so the image list parses ([6a0e68d](https://github.com/nullplatform/actions-nullplatform/commit/6a0e68d946ab6d4a8f83a096a57ce38bb36b6789))
* **ecr-security-scan:** pass inputs via env so the image list parses ([e407d93](https://github.com/nullplatform/actions-nullplatform/commit/e407d93942dcd4f6f8fc0f34d6bc4714ae966409))
* only treat the specific 'no checks reported' error as checkless, never merge unverified ([200fc0e](https://github.com/nullplatform/actions-nullplatform/commit/200fc0e2aebfed802b3d157c363f1664b38caf7d))
* **pr-checks:** gate the App token behind an opt-in input, not the org secret ([33e32f0](https://github.com/nullplatform/actions-nullplatform/commit/33e32f0b8e051a1aa2bd76e1653ca9521529ae21))
* read only first line for shebang check (avoids SC2015, heredoc false positives) ([b979cf7](https://github.com/nullplatform/actions-nullplatform/commit/b979cf78ecdb6e6a44b09a6c925f6cd893eb9212))
* **release-publish-oci:** address review — recovery path, artifact ([2dc2925](https://github.com/nullplatform/actions-nullplatform/commit/2dc2925d48bb991a54464a6476e0e1888989b0cf))
* **release-publish-oci:** keep one Artifact block per release and surface np errors ([5b2aa06](https://github.com/nullplatform/actions-nullplatform/commit/5b2aa063204a926aca2ddd8a2fa2fc19f1acdae1))
* **release-publish-oci:** keep one Artifact block per release and surface np errors ([7820844](https://github.com/nullplatform/actions-nullplatform/commit/7820844f556220a6969e83df9f57699fba4128ec))
* restore submodules default displaced by the ref input insertion ([1b58fc4](https://github.com/nullplatform/actions-nullplatform/commit/1b58fc446711851b944e661df7feacfdcef451c2))
* tolerate a release PR having zero checks registered yet ([e1349e0](https://github.com/nullplatform/actions-nullplatform/commit/e1349e086f1a32a6f1f50ec36081f04cd836b50e))

## [1.3.2](https://github.com/nullplatform/actions-nullplatform/compare/v1.3.1...v1.3.2) (2026-05-21)


### Bug Fixes

* **security-scan:** add actions: read permission required by codeql u… ([2c99588](https://github.com/nullplatform/actions-nullplatform/commit/2c995883d423356338f216215fc13b6bc8380b6a))
* **security-scan:** add actions: read permission required by codeql upload-sarif ([77df583](https://github.com/nullplatform/actions-nullplatform/commit/77df583d24a95037b43eb7507381a72c82b63162))

## [1.3.1](https://github.com/nullplatform/actions-nullplatform/compare/v1.3.0...v1.3.1) (2026-05-21)


### Bug Fixes

* **sign-image:** login to ecr public before signing so cosign can push the signature ([57c5ce2](https://github.com/nullplatform/actions-nullplatform/commit/57c5ce2e57d31e45a88373e4567444f608e0445f))
* **sign-image:** login to ecr public before signing so cosign can push the signature ([b2f1e3c](https://github.com/nullplatform/actions-nullplatform/commit/b2f1e3cda31bf1c18310905c3cd16f9f9e389b1f))

## [1.3.0](https://github.com/nullplatform/actions-nullplatform/compare/v1.2.1...v1.3.0) (2026-05-21)


### Features

* **security-scan:** add SARIF upload to docker and ECR security scans ([fdb8e24](https://github.com/nullplatform/actions-nullplatform/commit/fdb8e24449cad2526726edbb16113362b09a572f))

## [1.2.1](https://github.com/nullplatform/actions-nullplatform/compare/v1.2.0...v1.2.1) (2026-05-21)


### Bug Fixes

* **docker-build-push-ecr:** use build step digest output directly for multi-platform builds ([5505a3f](https://github.com/nullplatform/actions-nullplatform/commit/5505a3f7b03ce57eeb3b445d3c610f72864979ce))
* **docker-build-push-ecr:** use build step digest output directly for multi-platform builds ([f92d1a4](https://github.com/nullplatform/actions-nullplatform/commit/f92d1a4600215923b70ef1e3baef7ecfe64cb6c6))

## [1.2.0](https://github.com/nullplatform/actions-nullplatform/compare/v1.1.1...v1.2.0) (2026-05-21)


### Features

* **actions:** add trivy-tofu-scan reusable workflow ([b522300](https://github.com/nullplatform/actions-nullplatform/commit/b5223000aeed39f840f96a5b9bfb2557c3de2f05))

## [1.1.1](https://github.com/nullplatform/actions-nullplatform/compare/v1.1.0...v1.1.1) (2026-05-21)


### Bug Fixes

* **docker-build-push-ecr:** use build step output for digest instead of metadata-file ([7dcf2ae](https://github.com/nullplatform/actions-nullplatform/commit/7dcf2ae823e70eb0a94d4f27c82c776e4713cf63))
* **docker-build-push-ecr:** use build step output for digest instead of metadata-file ([cad0d0a](https://github.com/nullplatform/actions-nullplatform/commit/cad0d0a8a1779231fc4c5700fd9400e70fba27e6))

## [1.1.0](https://github.com/nullplatform/actions-nullplatform/compare/v1.0.2...v1.1.0) (2026-05-20)


### Features

* **actions:** add sign-image composite action for cosign + KMS signing ([62180f8](https://github.com/nullplatform/actions-nullplatform/commit/62180f86f1a5dceb5e57e94704721d9c0ac656e6))
* **actions:** add sign-image composite action for cosign + KMS signing ([dff9979](https://github.com/nullplatform/actions-nullplatform/commit/dff9979752d763854ff94b0488b0e433de913de8))
* **docker-build-push-ecr:** expose image digest as workflow output ([83112a5](https://github.com/nullplatform/actions-nullplatform/commit/83112a5382500ada061b1cb7e5cfc7bb587eb453))
* **docker-build-push-ecr:** expose image digest as workflow output ([3132795](https://github.com/nullplatform/actions-nullplatform/commit/3132795e9e02cc1a84d7949cf11b18bd6fd1c5ea))
* **sign-image:** configure AWS credentials inside composite action ([d7038c4](https://github.com/nullplatform/actions-nullplatform/commit/d7038c49ac3eca1ec89376b5a59a5edf7c9b2d2f))


### Bug Fixes

* install np cli and set api key in build-and-push job ([2804f8e](https://github.com/nullplatform/actions-nullplatform/commit/2804f8e2f9d2463aa3080699999330340a61adf6))
* install np cli and set api key in build-and-push job ([398991f](https://github.com/nullplatform/actions-nullplatform/commit/398991fe1985bfe004ed9c804f7021d1daa524ae))
* **sign-image:** add --recursive to sign per-platform manifests ([42a7efe](https://github.com/nullplatform/actions-nullplatform/commit/42a7efeb925f41aa187859ac027e4d29cf9b1fe9))
* **sign-image:** add --recursive to sign per-platform manifests ([d44436a](https://github.com/nullplatform/actions-nullplatform/commit/d44436ac8475d809be1ff6ae5e93d1a68a5f6da4))

## [1.0.2](https://github.com/nullplatform/actions-nullplatform/compare/v1.0.1...v1.0.2) (2026-05-06)


### Bug Fixes

* make release-please workflow generic via release-type input ([a27ada5](https://github.com/nullplatform/actions-nullplatform/commit/a27ada58c983bc9eb9496980693f8c868da1229e))

## [1.0.1](https://github.com/nullplatform/actions-nullplatform/compare/v1.0.0...v1.0.1) (2026-05-04)


### Bug Fixes

* force push automation branch in update-readme-actions ([b58334e](https://github.com/nullplatform/actions-nullplatform/commit/b58334eb9c60651df9268d21d1245acc6e58b496))
* force push automation branch to avoid rejected push on re-runs ([2fa3c51](https://github.com/nullplatform/actions-nullplatform/commit/2fa3c513fda9fcee856fd9933673720b4439bff5))

## 1.0.0 (2026-04-30)


### Features

* **actions-nullplatform-terraform:** add gitignore ([3b3a92e](https://github.com/nullplatform/actions-nullplatform/commit/3b3a92ec3b23c45882306c720c3839c1d6eca8f6))
* **actions-nullplatform:** add readme with github models ([56d2db0](https://github.com/nullplatform/actions-nullplatform/commit/56d2db0689f1bc03166c5181a5d2ed23f7f9b56e))
* **actions-nullplatform:** add readme with github models ([08d6218](https://github.com/nullplatform/actions-nullplatform/commit/08d62184e4d30fab480ac9af9347dcad976de213))
* **actions-terraform:** add new jobs ([ca5a3ec](https://github.com/nullplatform/actions-nullplatform/commit/ca5a3ecde00419e9bbe89b0b4a039e8a25d2142a))
* add modular README generator v2 with multi-project support ([129ca75](https://github.com/nullplatform/actions-nullplatform/commit/129ca7534a1f27392ccb1c1d1cc06b0bdf098599))
* add optional inputs to pnpm, go, and docker pr-check workflows ([87f1439](https://github.com/nullplatform/actions-nullplatform/commit/87f143903a3ea53bfb1063f417f828b2e6c9e77f))
* add permissions to release ([f6662ac](https://github.com/nullplatform/actions-nullplatform/commit/f6662ac9a4e8b87a2ae7eb0898d6e24384bab474))
* add pipeline ([49ecc55](https://github.com/nullplatform/actions-nullplatform/commit/49ecc55e372cfb3ec4c46a7b72b6177b1a313466))
* add pipeline ([64a7400](https://github.com/nullplatform/actions-nullplatform/commit/64a7400f4f538f132ab2a077a4a7ecfcf4fdc678))
* add pr-checks-node-pnpm-build reusable workflow ([f9a867d](https://github.com/nullplatform/actions-nullplatform/commit/f9a867de68c114fba185534d0accba88e808431f))
* add pr-checks-node-pnpm-build reusable workflow ([5823bf4](https://github.com/nullplatform/actions-nullplatform/commit/5823bf45f5f27473998ccfe4411af71a5c300a91))
* add pr-checks-terraform orchestrator workflow ([33813e7](https://github.com/nullplatform/actions-nullplatform/commit/33813e7cc5241cad8ffcb8e1cb8300a65cedeed9))
* add pr-checks-terraform orchestrator workflow ([28e1454](https://github.com/nullplatform/actions-nullplatform/commit/28e1454d5d81338224fdee06019c59b4d2aae24a))
* add release-please workflow for self-versioning ([6724664](https://github.com/nullplatform/actions-nullplatform/commit/672466489126e96419d3bf705f415a502999e515))
* add release-please workflow for self-versioning ([c45f155](https://github.com/nullplatform/actions-nullplatform/commit/c45f155a1626bebbd3402d1918fa9e56c354f201))
* add reusable PR checks workflows for SOC 2 change management ([fa3f661](https://github.com/nullplatform/actions-nullplatform/commit/fa3f661e608acda2140a8a56eafe4fb930c1202e))
* add reusable PR checks workflows for SOC 2 change management ([5ffbad0](https://github.com/nullplatform/actions-nullplatform/commit/5ffbad090d731991c742f2e4bbfb2499a6d834cd))
* add reusable tofu-test workflow for unit testing modules ([d6131c2](https://github.com/nullplatform/actions-nullplatform/commit/d6131c27a7325267a7fe5042bcb87f7e0a43a876))
* add run-first composite action and update node workflows to use it ([a851fda](https://github.com/nullplatform/actions-nullplatform/commit/a851fdab7c3d0285b868ae3ccc8d619668a8d588))
* add shellcheck reusable workflow ([418090a](https://github.com/nullplatform/actions-nullplatform/commit/418090a8470dc136a0251b0960c8b832551ca0ae))
* add shellcheck reusable workflow ([2032d32](https://github.com/nullplatform/actions-nullplatform/commit/2032d32749a8910d354243df1f6fb244228f4a83))
* add support for np ([9c5c9fe](https://github.com/nullplatform/actions-nullplatform/commit/9c5c9fee1632a192ac05c0bf547ed6f7fe88aa85))
* add support for np ([6365d96](https://github.com/nullplatform/actions-nullplatform/commit/6365d96bafdf04925215f2e646a44e00cdeb9f30))
* add tf docs and release ([6b75aa4](https://github.com/nullplatform/actions-nullplatform/commit/6b75aa429f3f6ebe9cd6f939d65085bfea970286))
* add tf docs and release ([170becd](https://github.com/nullplatform/actions-nullplatform/commit/170becdc9856b8bdd2c88c273a732876fd176fcf))
* add working-directory and node-version inputs to npm workflow ([af8d8f8](https://github.com/nullplatform/actions-nullplatform/commit/af8d8f8fb31086b4fd83294bf418ccad3e5bdc8d))
* add working-directory and node-version inputs to npm workflow ([5bb8592](https://github.com/nullplatform/actions-nullplatform/commit/5bb8592f4b976aad007049d9df254432ddc1189e))
* **commit:** add validate for conventional commit ([9f2c80d](https://github.com/nullplatform/actions-nullplatform/commit/9f2c80d72f467b724fbd21e8477214225448739e))
* **commit:** add validate for conventional commit ([30e00dc](https://github.com/nullplatform/actions-nullplatform/commit/30e00dc7941a39627e5191047518e36d67920979))
* **docker-security-scan:** add build_args input ([e56bc2e](https://github.com/nullplatform/actions-nullplatform/commit/e56bc2e53929286cefa4e14f3f6eb99129f26073))
* **docker:** add optional build_args input to docker-build-push-ecr ([825b2eb](https://github.com/nullplatform/actions-nullplatform/commit/825b2eb1a5948fb2d375b2cff82d43c2edc7ee54))
* maintain floating major version tag (v1) after each release ([3dfc73f](https://github.com/nullplatform/actions-nullplatform/commit/3dfc73f9e5f6ff13c03c7ea6c619af5eb990c26e))
* **readme-ai:** add trigger variables for conditional usage generation ([b7d0f92](https://github.com/nullplatform/actions-nullplatform/commit/b7d0f92abe895baae3a972be24e3be097f4a9edb))
* **readme:** add readme ([9c36b6e](https://github.com/nullplatform/actions-nullplatform/commit/9c36b6e96d3ee2547fef1b839847b4ed94e21de8))
* **release:** add job to update README versions after release ([6935157](https://github.com/nullplatform/actions-nullplatform/commit/6935157a8dc4e18b7d74e1ee963a01e9b8570078))
* syntax ([3d3a352](https://github.com/nullplatform/actions-nullplatform/commit/3d3a352f0d54940f0ceadad5bacc81985299acb4))
* syntax ([7af3b3e](https://github.com/nullplatform/actions-nullplatform/commit/7af3b3e6ecb772ad99cbf83d52a04381c5868859))
* **terraform:** add architecture section, AI metadata, and cache-aware regeneration ([c4fe51c](https://github.com/nullplatform/actions-nullplatform/commit/c4fe51c1bd503548650b1e7881937eaa2e36ff73))
* **terraform:** add architecture section, AI metadata, and cache-aware regeneration ([053cdd3](https://github.com/nullplatform/actions-nullplatform/commit/053cdd37f326fd7b2a59b94e0cff2286a283df54))
* **tfdocs:** add commit messages ([e8e11f0](https://github.com/nullplatform/actions-nullplatform/commit/e8e11f0eb12b8388d5e994517457078846a9d3d4))
* **workflows:** add generic changelog-release workflow ([de9452e](https://github.com/nullplatform/actions-nullplatform/commit/de9452e1aabcedc7f16a6b22765d87769cd825f5))
* **workflows:** add generic changelog-release workflow ([5bfb8bf](https://github.com/nullplatform/actions-nullplatform/commit/5bfb8bf732ee54ca1647ff437ddb8cf2920e676b))


### Bug Fixes

* **action-nullplatform:** add action to docker login ([cff3f3a](https://github.com/nullplatform/actions-nullplatform/commit/cff3f3ae504c5cf7dfa6c2e68525a8dd3f7dc5fa))
* **action-nullplatform:** add action to docker login ([38d5eef](https://github.com/nullplatform/actions-nullplatform/commit/38d5eef4795cf50dab4922b5558cad0ef6574f63))
* **action-nullplatform:** add parallel max to tofu test ([02a11b0](https://github.com/nullplatform/actions-nullplatform/commit/02a11b092ac6de309f94c244bb1af760ad84a003))
* **action-nullplatform:** delete file ([d03cee1](https://github.com/nullplatform/actions-nullplatform/commit/d03cee1b5554d47e7bf819c55b06c7d207ed2ba0))
* **action-nullplatform:** git ignore ([9b9077a](https://github.com/nullplatform/actions-nullplatform/commit/9b9077a5331be7d31f9d048267738142594c729b))
* **action-nullplatform:** git ignore ([775a38e](https://github.com/nullplatform/actions-nullplatform/commit/775a38e3ac9007ce06961c40bb6f0930992a68ac))
* add cache-dependency-path to setup-node in reusable node workflows ([0674078](https://github.com/nullplatform/actions-nullplatform/commit/067407844937245e5892d779b05281c9fba37fda))
* add cache-dependency-path to setup-node steps in reusable workflows ([cbc0747](https://github.com/nullplatform/actions-nullplatform/commit/cbc07472b0f9687b70e7656f7d4e63770c8c77c5))
* add packages: read permission to pr-checks-docker workflow ([e774285](https://github.com/nullplatform/actions-nullplatform/commit/e7742850290f85d693f563ec1386a36c42d6e7ba))
* add packages: read permission to pr-checks-docker workflow ([4cde0d8](https://github.com/nullplatform/actions-nullplatform/commit/4cde0d860a46d800a973b8777e2a194a3d9af0a8))
* add skip_backend input to tofu-lint workflow ([4484ee4](https://github.com/nullplatform/actions-nullplatform/commit/4484ee4119fca280605e979e7cecbcf5cff6dc01))
* add skip_backend input to tofu-lint workflow ([d0c41bf](https://github.com/nullplatform/actions-nullplatform/commit/d0c41bf490ed4841271971c7a71670cabb85067c))
* **ai:** upgrade Anthropic default model to Claude Sonnet 4.5 ([9d4740b](https://github.com/nullplatform/actions-nullplatform/commit/9d4740bec4335231766a290f3d7f34326f46b663))
* **ai:** upgrade Anthropic default model to Claude Sonnet 4.5 ([77e1278](https://github.com/nullplatform/actions-nullplatform/commit/77e12780c1b3163df728a6dca400f8587dc6e17a))
* **ci:** skip branch validation for release-please and upgrade setup-… ([8563529](https://github.com/nullplatform/actions-nullplatform/commit/8563529e51a4162f1a1462d2baa464b06d168076))
* **ci:** skip branch validation for release-please and upgrade setup-opentofu to v2 ([28e21b1](https://github.com/nullplatform/actions-nullplatform/commit/28e21b10ad51c11e4d6d729cfbbf61d137e80b5a))
* **ci:** update README via PR instead of direct push to main ([edfd217](https://github.com/nullplatform/actions-nullplatform/commit/edfd217db0cf8409f431767070cd7e9dc0ddd2ed))
* **ci:** update README via PR instead of direct push to main ([4ea22a6](https://github.com/nullplatform/actions-nullplatform/commit/4ea22a638c7825852a7f35ac8ee98ff5f8955f33))
* **ci:** update README via PR instead of direct push to main ([fd37564](https://github.com/nullplatform/actions-nullplatform/commit/fd375647b1b116cd29dba1e20a89624f59684131))
* **docker:** fix command injection and add BuildKit secret support ([a511466](https://github.com/nullplatform/actions-nullplatform/commit/a5114661d3cd233f741e02ab310b12595b626693))
* **docker:** fix command injection and add BuildKit secret support ([9872a7c](https://github.com/nullplatform/actions-nullplatform/commit/9872a7c02be8a769967d53971b7efb0082797a5c))
* **ecr-security-scan:** fix grep to find last image tag ([a95953e](https://github.com/nullplatform/actions-nullplatform/commit/a95953e4f56b662f82fc912a4dd90b4c8de5faa3))
* **ecr-security-scan:** fix grep to find last image tag ([76cee17](https://github.com/nullplatform/actions-nullplatform/commit/76cee179be09b6b70034b2827347de000e95a7ae))
* fix ubuntu version ([013df49](https://github.com/nullplatform/actions-nullplatform/commit/013df49d2a692d175e2247bd38ca74f1e4c12cc5))
* force nodejs 24 ([27ea27d](https://github.com/nullplatform/actions-nullplatform/commit/27ea27d05f363d5d240e6fb182599177cd3270de))
* force nodejs 24 ([bd449ec](https://github.com/nullplatform/actions-nullplatform/commit/bd449ec1078426e0141a20371932d1f3e5b2f1ec))
* pass skip_backend through pr-checks-terraform orchestrator ([5756660](https://github.com/nullplatform/actions-nullplatform/commit/575666002a329d85461805d9b8d76e2ec9304658))
* pass skip_backend through pr-checks-terraform orchestrator ([ee41451](https://github.com/nullplatform/actions-nullplatform/commit/ee41451f31fc51bcf25a5c46df370adca0fd20b6))
* pass working-directory to run-first action in node workflows ([0d87211](https://github.com/nullplatform/actions-nullplatform/commit/0d87211b4d52db83935b28076e3eb386073ac13b))
* pipeline ecr ([9797577](https://github.com/nullplatform/actions-nullplatform/commit/97975770a85c8ed0038cd968fd256f0ac31a3857))
* **readme-ai:** checkout scripts from actions-nullplatform repo ([c4b19e8](https://github.com/nullplatform/actions-nullplatform/commit/c4b19e8f4ecf1ac63fd505a9a8ac85151ec3eb3e))
* **readme-ai:** handle absolute paths in module source generation ([df67a38](https://github.com/nullplatform/actions-nullplatform/commit/df67a383c324429f180f5f8d978fba6a2388e58f))
* **readme-ai:** improve conditional sections with triggerValue and sorting ([5563393](https://github.com/nullplatform/actions-nullplatform/commit/55633932f6671f29d25851d1f8b35e68ab8dbc85))
* **release:** update ALL READMEs to new version, not just modified ones ([553a85c](https://github.com/nullplatform/actions-nullplatform/commit/553a85c125adeb9f526657ad06041a34ea075d5e))
* resolve SARIF upload error in tfsec workflow ([f729573](https://github.com/nullplatform/actions-nullplatform/commit/f7295737410e7688fca199510697f996c549c3db))
* resolve SARIF upload error in tfsec workflow ([7f85898](https://github.com/nullplatform/actions-nullplatform/commit/7f858986bd04f2ea0ed8dc2487f809067726ce4b))
* update trivy to v0.69.2 after security incident ([838d307](https://github.com/nullplatform/actions-nullplatform/commit/838d3075c8a071d7ba8be86e2881d668e840ee4f))
* update trivy to v0.69.2 after security incident ([1990f4e](https://github.com/nullplatform/actions-nullplatform/commit/1990f4e15b27cffdc74ad39b2ef164bda38fca64))
* update trivy-action from 0.33.1 to 0.34.2 ([f849804](https://github.com/nullplatform/actions-nullplatform/commit/f849804b3b69ae56bfcb4824eecbbf17bdd05a67))
* update trivy-action from 0.33.1 to 0.34.2 ([06cd159](https://github.com/nullplatform/actions-nullplatform/commit/06cd15962b62e265b7c6a9cde2a4209475e70e8a))
* use absolute ref for run-first action in pnpm workflow ([842b357](https://github.com/nullplatform/actions-nullplatform/commit/842b3573e62b500e114c734691b2a56c90dace71))
* use absolute ref for run-first action in pnpm workflow ([7e41d74](https://github.com/nullplatform/actions-nullplatform/commit/7e41d742fcd259d74b74cd8e86546ebedf5a6ded))
* use CI_TOKEN fallback in docker build for private packages ([9212998](https://github.com/nullplatform/actions-nullplatform/commit/9212998336918affa0e8eaef9d467d65815dcc62))
* use CI_TOKEN fallback in docker build workflow ([ae3473f](https://github.com/nullplatform/actions-nullplatform/commit/ae3473fcf774d1b22f9add80a6ca0f66ec338960))
* use ubuntu-24.04 and CI_TOKEN fallback in pnpm workflow ([2d03df1](https://github.com/nullplatform/actions-nullplatform/commit/2d03df15a9a04725f7f3505c03aa3960213e25a6))
* use ubuntu-24.04 and CI_TOKEN fallback in pnpm workflow ([4ce609b](https://github.com/nullplatform/actions-nullplatform/commit/4ce609be9c1233b8bf378408ca3650eb85256a91))
* use ubuntu-24.04 and CI_TOKEN fallback in pr-checks-node-npm ([0b4f739](https://github.com/nullplatform/actions-nullplatform/commit/0b4f739ed1cd7139f52fa3b9cd7eb06591b05ebc))
* use ubuntu-24.04 and CI_TOKEN fallback in pr-checks-node-npm workflow ([009443b](https://github.com/nullplatform/actions-nullplatform/commit/009443b3ce780f761ef42d6f4f080ce431239d6d))
* **worflows:** disble sarif report ([67ec4f7](https://github.com/nullplatform/actions-nullplatform/commit/67ec4f7dfec37e8f6901b0d11376acbc57b3f7d3))
* **worflows:** disble sarif report ([92beac9](https://github.com/nullplatform/actions-nullplatform/commit/92beac9caf35f6e323c32c8dec953b516da65c09))
* **worflows:** fix Docker Security Scan ([25744aa](https://github.com/nullplatform/actions-nullplatform/commit/25744aa93e74ec5d0a7ed9a730c5f4986982a2e8))
* **worflows:** fix Docker Security Scan ([92447df](https://github.com/nullplatform/actions-nullplatform/commit/92447df8a629a51102873ae2b82cfe973a02b8fb))
* **worflows:** fix ecr scan trivy version ([afbdaaa](https://github.com/nullplatform/actions-nullplatform/commit/afbdaaaf2bc540715eda0986ce2e8c34aa557ac4))
* **worflows:** fix ecr scan trivy version ([5db846f](https://github.com/nullplatform/actions-nullplatform/commit/5db846fb4ce1683cd67e7ea3b6d499fec16ba6b1))
* **worflows:** fix ecr scan trivy version ([62e75b3](https://github.com/nullplatform/actions-nullplatform/commit/62e75b36430fc23d1bb104b3773d2e5da499d620))
* **worflows:** fix ecr scan trivy version ([7257601](https://github.com/nullplatform/actions-nullplatform/commit/7257601f59577d12a68cc75e616260c2971c8fae))
* **worflows:** fix ecr scan trivy version ([ad2c928](https://github.com/nullplatform/actions-nullplatform/commit/ad2c928e329abd8fc0750d51b83bbf679d303bcb))
* **worflows:** fix ecr scan trivy version ([cb2cb19](https://github.com/nullplatform/actions-nullplatform/commit/cb2cb19a528e52cb8323b17fe06882a137f076ad))
* **worflows:** upgrade trivy version ([bf45ad5](https://github.com/nullplatform/actions-nullplatform/commit/bf45ad56b2ba3f9b717c693f2355d583d30c62c3))
* **worflows:** upgrade trivy version ([9cd40b9](https://github.com/nullplatform/actions-nullplatform/commit/9cd40b98f9ecfeb292a63801fb2ef2da145ac66b))
* **workflows:** fix formatting and indentation in tofu-lint workflow ([aceea93](https://github.com/nullplatform/actions-nullplatform/commit/aceea93b60f2ebc608eb632d5027c3838cdc20e9))
* **workflows:** fix formatting in tofu-lint workflow ([b374919](https://github.com/nullplatform/actions-nullplatform/commit/b3749190daa7a827e3b28e09e256e399e3bfb1cf))
* **workflows:** remove invalid 'models' permission from update-readme-actions ([0ff0659](https://github.com/nullplatform/actions-nullplatform/commit/0ff065927588ef0517c96a37ccc1f24294e3bf5b))
