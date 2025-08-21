export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center w-full h-[calc(100vh-4rem)] px-4">
			<div className="w-full max-w-2xl shadow-lg border-muted/20 bg-card/50 backdrop-blur-sm rounded-none border-dashed">
				<div className="space-y-1 p-6">
					<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
						<div className="w-5 h-5 rounded-full bg-muted-foreground/20 animate-pulse" />
					</div>
					<div className="h-8 w-48 bg-muted-foreground/20 rounded animate-pulse mb-2" />
					<div className="h-4 w-72 bg-muted-foreground/20 rounded animate-pulse" />
				</div>
				<div className="p-6 pt-4">
					<div className="rounded-lg border border-dashed border-muted-foreground/20 bg-muted/50 p-8 text-center">
						<div className="h-5 w-40 bg-muted-foreground/20 rounded animate-pulse mx-auto mb-2" />
						<div className="h-4 w-64 bg-muted-foreground/20 rounded animate-pulse mx-auto mb-6" />
						<div className="flex items-center justify-center gap-2">
							<div className="h-10 w-24 bg-muted-foreground/20 rounded animate-pulse" />
							<div className="h-10 w-24 bg-muted-foreground/20 rounded animate-pulse" />
						</div>
					</div>
				</div>
				<div className="flex justify-between border-t border-muted/20 p-6 pt-4">
					<div className="h-4 w-32 bg-muted-foreground/20 rounded animate-pulse" />
					<div className="h-4 w-24 bg-muted-foreground/20 rounded animate-pulse" />
				</div>
			</div>
		</div>
	)
}