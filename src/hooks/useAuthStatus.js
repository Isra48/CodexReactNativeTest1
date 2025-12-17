import { useEffect, useState } from "react";
import { getUser } from "../utils/storage";

export default function useAuthStatus() {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setLogged(!!user);
      setLoading(false);
    })();
  }, []);

  return { logged, loading, setLogged };
}
