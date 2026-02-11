function PageFooter() {
  return (
    <footer className="w-full bg-white px-6 pt-12 text-center">
      <p className="text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} Notes2Card. MADE WITH <span className="text-lg">♡</span>
      </p>
    </footer>
  );
}
export { PageFooter };
