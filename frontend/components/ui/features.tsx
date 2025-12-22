import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, Lock, Zap } from 'lucide-react'

export function Features() {
    return (
        <section className="py-12 sm:py-16 md:py-24">
            <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3 sm:gap-4">
                        {/* Multi-Signature Card */}
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 glass-card border-neutral-700/50 hover:border-cyan-500/30 transition-all duration-300">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <svg className="absolute inset-0 size-full text-neutral-700" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="mx-auto block w-fit text-5xl font-semibold bg-gradient-to-r from-cyan-400 to-green-500 bg-clip-text text-transparent">M/N</span>
                                </div>
                                <h2 className="mt-6 text-center text-2xl sm:text-3xl font-semibold text-white">Multi-Signature</h2>
                            </CardContent>
                        </Card>

                        {/* Security Card */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 glass-card border-neutral-700/50 hover:border-cyan-500/30 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-cyan-500/20 before:absolute before:-inset-2 before:rounded-full before:border before:border-cyan-500/10">
                                    <Shield className="m-auto size-16 text-cyan-400" strokeWidth={1.5} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg sm:text-xl font-semibold text-white">Secure by Default</h2>
                                    <p className="text-sm sm:text-base text-neutral-400">Every transaction requires multiple approvals. No single point of failure.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* On-Chain Card */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 glass-card border-neutral-700/50 hover:border-green-500/30 transition-all duration-300">
                            <CardContent className="pt-6">
                                <div className="pt-6 lg:px-6">
                                    <svg className="w-full text-neutral-700" viewBox="0 0 386 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="386" height="123" rx="10" />
                                        <g clipPath="url(#clip0_0_106)">
                                            <circle className="text-cyan-500/30" cx="29" cy="29" r="15" fill="currentColor" />
                                            <path d="M29 23V35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M35 29L29 35L23 29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path
                                                d="M55.2373 32H58.7988C61.7383 32 63.4404 30.1816 63.4404 27.0508V27.0371C63.4404 23.9404 61.7246 22.1357 58.7988 22.1357H55.2373V32ZM56.7686 30.6807V23.4551H58.6279C60.6719 23.4551 61.8818 24.7881 61.8818 27.0576V27.0713C61.8818 29.3613 60.6924 30.6807 58.6279 30.6807H56.7686ZM69.4922 32.1436C71.666 32.1436 72.999 30.6875 72.999 28.2949V28.2812C72.999 25.8887 71.6592 24.4326 69.4922 24.4326C67.3184 24.4326 65.9785 25.8955 65.9785 28.2812V28.2949C65.9785 30.6875 67.3115 32.1436 69.4922 32.1436ZM69.4922 30.9062C68.2139 30.9062 67.4961 29.9424 67.4961 28.2949V28.2812C67.4961 26.6338 68.2139 25.6699 69.4922 25.6699C70.7637 25.6699 71.4883 26.6338 71.4883 28.2812V28.2949C71.4883 29.9355 70.7637 30.9062 69.4922 30.9062ZM76.9111 32H78.4219L79.9531 26.4629H80.0693L81.6074 32H83.1318L85.1758 24.5762H83.7061L82.3799 30.3047H82.2637L80.7324 24.5762H79.3242L77.793 30.3047H77.6836L76.3506 24.5762H74.8604L76.9111 32ZM87.6934 32H89.1768V27.6455C89.1768 26.4492 89.8535 25.7041 90.9404 25.7041C92.0273 25.7041 92.54 26.3125 92.54 27.543V32H94.0166V27.1943C94.0166 25.4238 93.1006 24.4326 91.4395 24.4326C90.3594 24.4326 89.6484 24.9111 89.2861 25.7041H89.1768V24.5762H87.6934V32ZM97.1562 32H98.6396V21.6641H97.1562V32ZM104.992 32.1436C107.166 32.1436 108.499 30.6875 108.499 28.2949V28.2812C108.499 25.8887 107.159 24.4326 104.992 24.4326C102.818 24.4326 101.479 25.8955 101.479 28.2812V28.2949C101.479 30.6875 102.812 32.1436 104.992 32.1436ZM104.992 30.9062C103.714 30.9062 102.996 29.9424 102.996 28.2949V28.2812C102.996 26.6338 103.714 25.6699 104.992 25.6699C106.264 25.6699 106.988 26.6338 106.988 28.2812V28.2949C106.988 29.9355 106.264 30.9062 104.992 30.9062ZM113.307 32.123C114.291 32.123 115.07 31.6992 115.508 30.9473H115.624V32H117.094V26.9209C117.094 25.3623 116.041 24.4326 114.175 24.4326C112.486 24.4326 111.317 25.2461 111.14 26.4629L111.133 26.5107H112.562L112.568 26.4834C112.746 25.957 113.286 25.6562 114.106 25.6562C115.111 25.6562 115.624 26.1074 115.624 26.9209V27.5771L113.614 27.6934C111.844 27.8027 110.846 28.5752 110.846 29.9014V29.915C110.846 31.2617 111.892 32.123 113.307 32.123ZM112.322 29.8535V29.8398C112.322 29.1699 112.787 28.8008 113.812 28.7393L115.624 28.623V29.2588C115.624 30.2158 114.811 30.9404 113.703 30.9404C112.903 30.9404 112.322 30.5371 112.322 29.8535ZM122.893 32.123C123.932 32.123 124.745 31.6445 125.176 30.8311H125.292V32H126.769V21.6641H125.292V25.752H125.176C124.779 24.9521 123.911 24.4463 122.893 24.4463C121.006 24.4463 119.816 25.9297 119.816 28.2812V28.2949C119.816 30.626 121.026 32.123 122.893 32.123ZM123.316 30.8584C122.072 30.8584 121.327 29.8877 121.327 28.2949V28.2812C121.327 26.6885 122.072 25.7178 123.316 25.7178C124.547 25.7178 125.312 26.6953 125.312 28.2812V28.2949C125.312 29.8809 124.554 30.8584 123.316 30.8584Z"
                                                fill="currentColor"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_0_106">
                                                <rect width="358" height="30" fill="white" transform="translate(14 14)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="relative z-10 mt-8 sm:mt-14 space-y-2 text-center">
                                    <h2 className="text-lg sm:text-xl font-semibold text-white">Fully On-Chain</h2>
                                    <p className="text-sm sm:text-base text-neutral-400">All data stored on Ethereum. Transparent and verifiable.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Threshold Control Card */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 glass-card border-neutral-700/50 hover:border-green-500/30 transition-all duration-300">
                            <CardContent className="grid pt-6 sm:grid-cols-2 gap-6">
                                <div className="relative z-10 flex flex-col justify-between space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border border-green-500/20 before:absolute before:-inset-2 before:rounded-full before:border before:border-green-500/10">
                                        <Lock className="m-auto size-6 text-green-400" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg sm:text-xl font-semibold text-white">Threshold Control</h2>
                                        <p className="text-sm sm:text-base text-neutral-400">Define custom approval thresholds. Perfect for teams and DAOs.</p>
                                    </div>
                                </div>
                                <div className="relative flex items-center justify-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 blur-3xl"></div>
                                        <div className="relative glass-dark rounded-2xl p-6 border border-neutral-700/50">
                                            <div className="text-center space-y-2">
                                                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-500 bg-clip-text text-transparent font-mono">2/3</div>
                                                <div className="text-xs text-neutral-500 uppercase tracking-wider">Required</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team Management Card */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 glass-card border-neutral-700/50 hover:border-cyan-500/30 transition-all duration-300">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2 gap-6">
                                <div className="relative z-10 flex flex-col justify-between space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border border-cyan-500/20 before:absolute before:-inset-2 before:rounded-full before:border before:border-cyan-500/10">
                                        <Users className="m-auto size-6 text-cyan-400" strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg sm:text-xl font-semibold text-white">Team Management</h2>
                                        <p className="text-sm sm:text-base text-neutral-400">Add unlimited owners. Perfect for treasury management.</p>
                                    </div>
                                </div>
                                <div className="relative before:absolute before:inset-0 before:mx-auto before:w-px before:bg-neutral-800 sm:-my-6 sm:-mr-6">
                                    <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="block h-fit rounded-lg border border-neutral-700/50 bg-neutral-900/50 px-3 py-1.5 text-xs text-neutral-300">Owner 1</span>
                                            <div className="ring-neutral-900 size-7 ring-4">
                                                <div className="size-full rounded-full bg-gradient-to-br from-cyan-500 to-green-500"></div>
                                            </div>
                                        </div>
                                        <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2">
                                            <div className="ring-neutral-900 size-8 ring-4">
                                                <div className="size-full rounded-full bg-gradient-to-br from-green-500 to-cyan-500"></div>
                                            </div>
                                            <span className="block h-fit rounded-lg border border-neutral-700/50 bg-neutral-900/50 px-3 py-1.5 text-xs text-neutral-300">Owner 2</span>
                                        </div>
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="block h-fit rounded-lg border border-neutral-700/50 bg-neutral-900/50 px-3 py-1.5 text-xs text-neutral-300">Owner 3</span>
                                            <div className="ring-neutral-900 size-7 ring-4">
                                                <div className="size-full rounded-full bg-gradient-to-br from-cyan-400 to-green-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
