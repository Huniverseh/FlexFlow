const HomePage = () => {
  return (
    <div className="space-y-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary-light">我的训练计划</h1>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          FlexFlow
        </span>
      </header>
      <p className="text-sm text-text-secondary-light">
        在这里创建、管理并开始你的训练计划。后续步骤会补充完整的列表与交互。
      </p>
    </div>
  )
}

export default HomePage
