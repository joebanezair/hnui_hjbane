import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Link } from '@heroui/link';

import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';
import { Chip } from '@heroui/chip';
import React, { useEffect, useState } from 'react'
import { siteConfig } from '@/config/site';
import { LoginTextData } from '@/apptexts/TextAndLanguage';
import { Button } from '@heroui/button';
import { SquareArrowUpRight } from 'lucide-react';
import { logoutWithRouter } from '../../indoor_components/components/logoutWithRouter';
const MyProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, [API_BASE]);

  const AppText = LoginTextData;
  return (<>
    {profile ? (<>
      <Card className="max-w-full" radius='none' shadow='none'>
        <CardHeader className="flex gap-3">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">
              {profile?.firstName ? profile.firstName : ""} {profile?.lastName ? profile.lastName : ""}
            </p>
            <p className="text-small text-default-500">
              {profile?.email ? `${profile.email}` : ""}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className='flex-row'>
          <Button 
          startContent={<SquareArrowUpRight />}
          onClick={logoutWithRouter}
          className='w-fit' variant="ghost" radius='sm' size='sm' style={{fontWeight:"bold", border:"none", 
          paddingLeft: 3, paddingRight: 10}} color="secondary">{AppText.LogOut}</Button>
        </CardBody>
        <Divider />
        <CardFooter>
          <Link isExternal showAnchorIcon href="https://github.com/heroui-inc/heroui">
            Visit source code on GitHub.
          </Link>
        </CardFooter>
      </Card>
    </>) : (
      <>
        <Card className="max-w-full" radius='none' shadow='none' style={{ border: "0.5px solid lightgray" }}>
          <p>Loading profile... {API_BASE}</p>
        </Card>
      </>
    )}
  </>)
}

export {
  MyProfile
}