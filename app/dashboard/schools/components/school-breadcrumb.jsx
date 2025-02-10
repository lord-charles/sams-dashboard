import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export function SchoolBreadcrumb() {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {/* <BreadcrumbItem>
                    <BreadcrumbLink href="/schools">Schools</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator /> */}
                <BreadcrumbItem>
                    <BreadcrumbPage>Schools</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
