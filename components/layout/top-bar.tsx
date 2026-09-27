import { MobileSearch } from "./mobile-search";
import { NotificationButton } from "./notification-button";
import { RoleSwitcher } from "./role-switcher";
import { SearchField } from "./search-field";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-[1264px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1 md:flex-none">
          <p className="truncate text-[15px] font-semibold text-ink">Shanti Asiatic School</p>
          <p className="truncate text-xs text-ink-faint md:hidden">HealthConnect</p>
        </div>
        <SearchField className="hidden max-w-md flex-1 md:ml-6 md:block" />
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <MobileSearch />
          <NotificationButton />
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
