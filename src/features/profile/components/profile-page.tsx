'use client';

import React, { useState } from 'react';
import { useProfile } from '../hooks/use-profile';
import { useAuth } from '@/src/shared/providers/auth-context';
import { UserAvatar } from '@/src/shared/components/user-avatar';
import { Button } from '@/src/shared/components/ui/button';
import { Badge } from '@/src/shared/components/ui/badge';
import { Card, CardContent } from '@/src/shared/components/ui/card';
import { ErrorState } from '@/src/shared/components/error-state';
import { ProfileSkeleton } from './profile-skeleton';
import { EditProfileDialog } from './edit-profile-dialog';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
  Calendar,
  Pencil,
  FileText,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ProfilePage() {
  const t = useTranslations('profile');
  const { user: authUser } = useAuth();
  const { data: profileUser, isLoading, isError, refetch } = useProfile();
  const [editOpen, setEditOpen] = useState(false);

  // Fallback to authContext user if profile query is loading or unavailable
  const user = profileUser || authUser;

  if (isLoading && !authUser) return <ProfileSkeleton />;
  if (isError && !authUser) return <ErrorState title={t('page_title')} onRetry={refetch} />;

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header Hero Card */}
      <Card className="border-border/80 bg-card overflow-hidden shadow-2xs">
        <div className="h-24 bg-gradient-to-r from-primary/15 via-primary/5 to-accent/15 border-b border-border/40" />
        <CardContent className="p-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-start">
              <div className="ring-4 ring-card rounded-full bg-card shadow-md">
                <UserAvatar
                  user={user}
                  sizeClassName="h-24 w-24 text-2xl"
                />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-mono py-0 px-2 ${
                      user.role === 'ADMIN'
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {user.role}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] py-0 px-2 gap-1 ${
                      user.isActive
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}
                  >
                    {user.isActive ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>{user.isActive ? t('active') : t('inactive')}</span>
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <Button
              onClick={() => setEditOpen(true)}
              className="gap-2 font-semibold shadow-xs h-9 px-4"
            >
              <Pencil className="h-4 w-4" />
              <span>{t('edit_profile')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-border/80 bg-card shadow-2xs">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/40 pb-3">
              <User className="h-4 w-4 text-primary" />
              <span>{t('personal_info')}</span>
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">{t('full_name')}</p>
                  <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">{t('phone_number')}</p>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user.phone || <span className="italic text-muted-foreground/60">{t('no_phone')}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">{t('job_title')}</p>
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user.job || <span className="italic text-muted-foreground/60">{t('no_job')}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">{t('bio_description')}</p>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap mt-0.5">
                    {user.description || <span className="italic text-muted-foreground/60">{t('no_bio')}</span>}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account & Security */}
        <Card className="border-border/80 bg-card shadow-2xs">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/40 pb-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>{t('account_security')}</span>
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">{t('email_address')}</p>
                  <p className="text-xs font-semibold text-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <ShieldCheck className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">{t('role_label')}</p>
                  <p className="text-xs font-semibold text-foreground capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">{t('status_label')}</p>
                  <p className="text-xs font-semibold text-foreground">
                    {user.isActive ? t('active') : t('inactive')}
                  </p>
                </div>
              </div>

              {user.createdAt && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-muted-foreground">{t('member_since')}</p>
                    <p className="text-xs font-semibold text-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
