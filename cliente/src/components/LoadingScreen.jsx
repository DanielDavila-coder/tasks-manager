import PageGlow from "./PageGlow";
function LoadingScreen({ text = "Loading..." }) {
  return (
    <div className="relative   isolate flex min-h-[calc(100vh-120px)] items-center justify-center px-4 ">
      <PageGlow />

      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-purple-500" />
        <p className="text-sm font-medium text-zinc-300">{text}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
