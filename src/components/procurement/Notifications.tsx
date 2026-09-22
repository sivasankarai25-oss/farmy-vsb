import React, { useEffect } from 'react';
import { Bell, BellRing, CheckCheck } from 'lucide-react';
import { AppNotification } from '../../procurement/types';
import { markNotificationsRead } from '../../procurement/service';
import type { TFn } from '../../procurement/i18n';
import { BackBar, Card, EmptyState } from './ui';

export function notificationText(n: AppNotification, t: TFn): { title: string; message: string } {
  const [token, counter] = n.message.split('|');
  if (n.title === 'BOOKING_CONFIRMED') return { title: t('nt_BOOKING_CONFIRMED'), message: t('nm_BOOKING_CONFIRMED', { token }) };
  const status = n.title.replace('STATUS_', '');
  return {
    title: t(`nt_${status}` as never),
    message: t(`nm_${status}` as never, { token, counter: counter ?? '' }),
  };
}

interface Props {
  t: TFn;
  items: AppNotification[];
  onBack: () => void;
}

export const Notifications: React.FC<Props> = ({ t, items, onBack }) => {
  const unread = items.filter(i => !i.read);
  const canAsk = typeof Notification !== 'undefined' && Notification.permission === 'default';
  const [perm, setPerm] = React.useState<string>(typeof Notification !== 'undefined' ? Notification.permission : 'denied');

  useEffect(() => {
    // Mark everything as read once the farmer has opened this screen.
    if (unread.length) {
      const id = setTimeout(() => { markNotificationsRead(unread.map(u => u.id)).catch(() => {}); }, 1500);
      return () => clearTimeout(id);
    }
  }, [unread.length]);

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">
      <BackBar
        title={t('notifications')}
        onBack={onBack}
        right={unread.length > 0 ? (
          <button onClick={() => markNotificationsRead(unread.map(u => u.id)).catch(() => {})} className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5" /> {t('markAllRead')}
          </button>
        ) : undefined}
      />

      {canAsk && perm === 'default' && (
        <Card className="p-3 flex items-center gap-3">
          <BellRing className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-xs text-stone-600 flex-1">{t('enableAlertsHint')}</p>
          <button onClick={() => Notification.requestPermission().then(setPerm)} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shrink-0">{t('enable')}</button>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState icon={<Bell className="w-6 h-6" />} title={t('noNotifications')} text={t('noNotificationsHint')} />
      ) : (
        <div className="space-y-2">
          {items.map(n => {
            const txt = notificationText(n, t);
            return (
              <Card key={n.id} className={`p-3.5 flex gap-3 ${n.read ? '' : 'border-emerald-300 bg-emerald-50/40'}`}>
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-stone-300' : 'bg-emerald-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-stone-900">{txt.title}</div>
                  <p className="text-xs text-stone-600 mt-0.5">{txt.message}</p>
                  <p className="text-[10px] text-stone-400 mt-1" dir="ltr">
                    {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
