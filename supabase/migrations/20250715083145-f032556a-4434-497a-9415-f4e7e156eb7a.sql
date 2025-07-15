
-- Créer un utilisateur test dans auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '31b8de5f-5d2b-445f-97b6-d595eb6ab8fc',
  'r.henda@icloud.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"first_name": "Rami", "last_name": "Henda"}',
  false,
  'authenticated'
);

-- Créer le profil correspondant
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  plan,
  subscription_status,
  subscription_end_date,
  created_at,
  updated_at
) VALUES (
  '31b8de5f-5d2b-445f-97b6-d595eb6ab8fc',
  'r.henda@icloud.com',
  'Rami',
  'Henda',
  'monthly',
  'trial',
  now() + interval '30 days',
  now(),
  now()
);
