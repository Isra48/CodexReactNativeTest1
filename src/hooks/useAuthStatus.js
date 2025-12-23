import { useEffect, useState } from "react";
import { getUser } from "../utils/storage";

const DEMO_MODE = true;

export default function useAuthStatus() {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      setLogged(true);
      setLoading(false);
      return;
    }

    (async () => {
      const user = await getUser();
      setLogged(!!user);
      setLoading(false);
    })();
  }, []);

  return { logged, loading, setLogged };
}

