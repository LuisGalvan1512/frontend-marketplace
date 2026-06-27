export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#161617] border-t border-gray-200 dark:border-white/10 mt-auto transition-colors duration-300">
      <div className="max-w-[1024px] mx-auto px-4 py-8">
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} TechStore. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
