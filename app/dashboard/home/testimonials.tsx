import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Quote } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"

export default function Testimonials({ schoolsData }: { schoolsData: any }) {
  const calculateSchoolTotals = () => {
    let totalPrimary = 0
    let totalSecondary = 0
    let totalECD = 0
    let totalCGS = 0
    let totalALP = 0
    let totalASP = 0

    schoolsData.forEach((state: any) => {
      totalPrimary += state.PRI
      totalSecondary += state.SEC
      totalECD += state.ECD
      totalCGS += state.CGS
      totalALP += state.ALP
      totalASP += state.ASP
    })

    const totalSchools = totalPrimary + totalSecondary + totalECD + totalCGS + totalALP + totalASP

    return {
      totalSchools,
      totalPrimary,
      totalSecondary,
      totalECD,
      totalCGS,
      totalALP,
      totalASP,
    }
  }
  
  const { totalSchools } = calculateSchoolTotals()

  useEffect(() => {
    localStorage.setItem('totalSchools', totalSchools.toString())
  }, [totalSchools])

  return (
    <section className="relative py-4  overflow-hidden mb-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-green-100 dark:bg-green-900/20 blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,128,0,0.02)_0,transparent_70%)]"></div>
        </div>
      </div> 

      <div className="relative z-10 mx-auto  space-y-8 px-6">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="inline-block mb-6">
            <span className="inline-flex items-center justify-center px-4 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Success Stories
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
            Transforming Education in South Sudan
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Our school management system is empowering educators and administrators across South Sudan to streamline
            operations and improve educational outcomes.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
          <Card className="sm:col-span-2 lg:col-span-6 lg:row-span-2 group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <CardContent className="p-8 h-full">
              <div className="relative hidden lg:block mb-4">
                <div className=" inset-0 bg-gradient-to-b from-primary/10 to-background/50 z-10" />
                    <Image
                           priority
                           width={200}
                           height={200}
                           src="/img/mogei.png"
                           className="object-contain w-[120px] h-[120px]"
                           alt="Mogei logo for GESS South Sudan"
                         />
                    </div>
              <div className="flex flex-col gap-8">
                <div className="mb-6">
                  <Quote className="h-10 w-10 text-green-500/20 dark:text-green-400/20" />
                </div>
                <blockquote className="flex-1 mb-0">
                  <p className="text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                    This school management system has revolutionized how we operate. Before, we were drowning in
                    paperwork and manual processes. Now, everything from student registration to grade tracking is
                    streamlined and efficient. Our teachers can focus more on teaching and less on administrative tasks.
                    It&apos;s truly transformed our school&apos;s operations.
                  </p>
                </blockquote>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <Avatar className="h-14 w-14 border-2 border-white dark:border-slate-800 shadow-sm">
                    <AvatarImage src="/placeholder.svg?height=400&width=400" alt="James Deng" />
                    <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      JD
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">James Deng</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      School Principal, Juba Secondary School
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-6 group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <CardContent className="p-8 h-full">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-blue-500/20 dark:text-blue-400/20" />
                </div>
                <blockquote className="flex-1 mb-6">
                  <p className="text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                    As a teacher, I appreciate how easy it is to track student attendance and performance. The system is
                    intuitive and has helped me identify struggling students much earlier.
                  </p>
                </blockquote>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-sm">
                    <AvatarImage src="/placeholder.svg?height=400&width=400" alt="Sarah Ayen" />
                    <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      SA
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Sarah Ayen</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Mathematics Teacher, Wau</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <CardContent className="p-6 h-full">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <Quote className="h-6 w-6 text-amber-500/20 dark:text-amber-400/20" />
                </div>
                <blockquote className="flex-1 mb-6">
                  <p className="text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                    The financial management module has been a game-changer for our school. We can now track fees,
                    expenses, and budgets with precision.
                  </p>
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                    <AvatarImage src="/placeholder.svg?height=400&width=400" alt="Peter Marial" />
                    <AvatarFallback className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      PM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Peter Marial</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Administrator, Malakal</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <CardContent className="p-6 h-full">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <Quote className="h-6 w-6 text-purple-500/20 dark:text-purple-400/20" />
                </div>
                <blockquote className="flex-1 mb-6">
                  <p className="text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                    As a parent, I love being able to check my children&apos;s progress online. The communication between
                    teachers and parents has improved significantly.
                  </p>
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                    <AvatarImage src="/placeholder.svg?height=400&width=400" alt="Mary Akol" />
                    <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      MA
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Mary Akol</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Parent, Juba</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 mt-16">
          <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-1.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm">
            <span className="inline-flex h-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 text-xs font-medium text-green-800 dark:text-green-300">
              {totalSchools}+ Schools
            </span>
            <div className="mx-3 text-sm">Successfully implemented across South Sudan</div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <Link
              href="#"
              className="relative flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01]"
            >
              <span>View More Success Stories</span>
              <span className="p-1 rounded-full bg-green-100 dark:bg-green-900/50 group-hover:bg-green-200 dark:group-hover:bg-green-900 transition-colors duration-300">
                <ArrowRight className="w-4 h-4 text-green-700 dark:text-green-400" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
    </section>
  )
}
