import Link from "next/link";

export default function AccountOverviewPage() {
  return (
    <div>
      <h1 className="font-serif text-5xl leading-tight text-charcoal">
        Welcome Back.
      </h1>
      <p className="mt-3 text-stone">
        Everything you need for your next visit to Asteria.
      </p>

      <div className="mt-10 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.15em] text-terracotta">
          YOUR ACTIVE ORDER
        </p>
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone">You have no active orders right now.</p>
          <Link
            href="/menu"
            className="text-sm font-medium tracking-wide text-charcoal"
          >
            EXPLORE THE MENU →
          </Link>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.15em] text-terracotta">
          UPCOMING RESERVATION
        </p>
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone">You have no upcoming reservations.</p>
          <Link
            href="/reservations"
            className="text-sm font-medium tracking-wide text-charcoal"
          >
            RESERVE A TABLE →
          </Link>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.15em] text-terracotta">
          RECENT ACTIVITY
        </p>
        <p className="mt-4 text-stone">
          Your order and reservation history will appear here once you place
          your first order.
        </p>
      </div>
    </div>
  );
}